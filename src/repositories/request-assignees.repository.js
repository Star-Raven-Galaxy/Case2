import { RequestAssignee, Technician } from '../db/index.js';

export const requestAssigneesRepository = {
  async deleteByRequestId(requestId, transaction) {
    return RequestAssignee.destroy({ where: { requestId }, transaction });
  },

  async bulkCreate(rows, transaction) {
    return RequestAssignee.bulkCreate(rows, { transaction });
  },

  async deleteOne(requestId, technicianId, transaction) {
    return RequestAssignee.destroy({
      where: { requestId, technicianId },
      transaction,
    });
  },

  async findByRequestId(requestId, transaction) {
    return RequestAssignee.findAll({
      where: { requestId },
      include: [{ model: Technician, as: 'technician' }],
      transaction,
    });
  },

  async findTechniciansByIds(ids, transaction) {
    return Technician.findAll({ where: { id: ids }, transaction });
  },
};