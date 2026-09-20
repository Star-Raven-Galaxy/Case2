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

  async changeStatus(id, nextStatus) {
    const request = await this.getById(id);
    const allowed = ALLOWED_TRANSITIONS[request.status] || [];

    if (!allowed.includes(nextStatus)) {
      throw new ConflictError(
        `Переход ${request.status} → ${nextStatus} недопустим`
      );
    }

    return requestsRepository.update(id, { status: nextStatus });
  },

  async remove(id) {
    await this.getById(id);
    await requestsRepository.remove(id);
  },
};