import { sequelize, MaintenanceRequest, RequestStatusHistory } from '../db/index.js';
import { requestsRepository } from '../repositories/requests.repository.js';
import { equipmentRepository } from '../repositories/equipment.repository.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { ConflictError } from '../errors/ConflictError.js';

const ALLOWED_TRANSITIONS = {
  new: ['in_progress', 'rejected'],
  in_progress: ['done', 'rejected'],
  done: [],
  rejected: [],
};

export const requestsService = {
  async list(query) {
    return requestsRepository.findAll(query);
  },

  async getById(id) {
    const request = await requestsRepository.findById(id);
    if (!request) throw new NotFoundError('Заявка');
    return request;
  },

  async create(payload) {
    const equipment = await equipmentRepository.findById(payload.equipmentId);
    if (!equipment) throw new NotFoundError('Оборудование');

    return requestsRepository.create(payload);
  },

  async update(id, patch) {
    await this.getById(id);
    return requestsRepository.update(id, patch);
  },

  async changeStatus(id, nextStatus, changedBy = 'system', comment = null) {
    return sequelize.transaction(async (t) => {
      const request = await MaintenanceRequest.findByPk(id, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      if (!request) throw new NotFoundError('Заявка');

      const allowed = ALLOWED_TRANSITIONS[request.status] || [];
      if (!allowed.includes(nextStatus)) {
        throw new ConflictError(
          `Переход ${request.status} → ${nextStatus} недопустим`
        );
      }

      if (nextStatus === 'in_progress') {
        const assigneesCount = await requestsRepository.countAssignees(id, t);
        if (assigneesCount === 0) {
          throw new ConflictError(
            'Нельзя перевести в in_progress без назначенных исполнителей'
          );
        }
      }

      const oldStatus = request.status;
      const closedAt =
        nextStatus === 'done' || nextStatus === 'rejected' ? new Date() : null;

      await request.update({ status: nextStatus, closedAt }, { transaction: t });

      await RequestStatusHistory.create(
        {
          requestId: id,
          oldStatus,
          newStatus: nextStatus,
          changedBy,
          comment,
        },
        { transaction: t }
      );

      return request;
    });
  },

  async getHistory(id) {
    await this.getById(id);
    return requestsRepository.findHistory(id);
  },

  async remove(id) {
    await this.getById(id);
    await requestsRepository.remove(id);
  },
};