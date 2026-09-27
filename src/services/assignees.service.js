import { sequelize, MaintenanceRequest } from '../db/index.js';
import { requestAssigneesRepository } from '../repositories/request-assignees.repository.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { AppError } from '../errors/AppError.js';

export const assigneesService = {
  async assign(requestId, assignees) {
    return sequelize.transaction(async (t) => {
      const request = await MaintenanceRequest.findByPk(requestId, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      if (!request) throw new NotFoundError('Заявка');

      const leads = assignees.filter((a) => a.role === 'lead');
      if (leads.length !== 1) {
        throw new AppError('Ровно один специалист должен быть с ролью lead', {
          status: 422,
          code: 'INVALID_TEAM',
        });
      }

      const ids = assignees.map((a) => a.technicianId);
      const found = await requestAssigneesRepository.findTechniciansByIds(ids, t);
      if (found.length !== ids.length) throw new NotFoundError('Специалист');

      await requestAssigneesRepository.deleteByRequestId(requestId, t);

      const rows = assignees.map((a) => ({
        requestId,
        technicianId: a.technicianId,
        role: a.role,
        hours: a.hours ?? 0,
      }));
      await requestAssigneesRepository.bulkCreate(rows, t);

      return requestAssigneesRepository.findByRequestId(requestId, t);
    });
  },

  async unassign(requestId, technicianId) {
    return sequelize.transaction(async (t) => {
      const request = await MaintenanceRequest.findByPk(requestId, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      if (!request) throw new NotFoundError('Заявка');

      const deleted = await requestAssigneesRepository.deleteOne(
        requestId,
        technicianId,
        t
      );
      if (!deleted) throw new NotFoundError('Назначение');

      return true;
    });
  },
};