import { Op } from 'sequelize';
import {
  MaintenanceRequest,
  Equipment,
  Technician,
  RequestStatusHistory,
} from '../db/index.js';

const SORTABLE = ['title', 'priority', 'status', 'createdAt', 'plannedAt'];
const OPEN_STATUSES = ['new', 'in_progress'];

export const requestsRepository = {
  async findAll({
    equipmentId,
    status,
    priority,
    page = 1,
    limit = 10,
    sort = 'createdAt',
    order = 'desc',
    from,
    to,
  }) {
    const field = SORTABLE.includes(sort) ? sort : 'createdAt';
    const dir = order === 'asc' ? 'ASC' : 'DESC';

    const where = {};
    if (equipmentId) where.equipmentId = equipmentId;
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt[Op.gte] = from;
      if (to) where.createdAt[Op.lte] = to;
    }

    const { rows, count } = await MaintenanceRequest.findAndCountAll({
      where,
      include: [
        {
          model: Equipment,
          as: 'equipment',
          attributes: ['id', 'name', 'serialNumber', 'type', 'status'],
        },
        {
          model: Technician,
          as: 'technicians',
          attributes: ['id', 'fullName', 'specialization'],
          through: { attributes: ['role', 'hours'] },
        },
      ],
      order: [[field, dir]],
      limit,
      offset: (page - 1) * limit,
      distinct: true,
    });

    return { data: rows, total: count, page, limit };
  },

  async findById(id) {
    return MaintenanceRequest.findByPk(id, {
      include: [
        { model: Equipment, as: 'equipment' },
        {
          model: Technician,
          as: 'technicians',
          through: { attributes: ['role', 'hours'] },
        },
        {
          model: RequestStatusHistory,
          as: 'history',
          separate: true,
          order: [['createdAt', 'ASC']],
        },
      ],
    });
  },

  async findByEquipmentId(equipmentId) {
    return MaintenanceRequest.findAll({
      where: { equipmentId },
      include: [{ model: Equipment, as: 'equipment', attributes: ['id', 'name'] }],
      order: [['createdAt', 'DESC']],
    });
  },

  async findOpenByEquipmentId(equipmentId) {
    return MaintenanceRequest.findAll({
      where: { equipmentId, status: { [Op.in]: OPEN_STATUSES } },
      attributes: ['id', 'status'],
    });
  },

  async create(data) {
    return MaintenanceRequest.create(data);
  },

  async update(id, patch, options = {}) {
    const request = await MaintenanceRequest.findByPk(id, options);
    if (!request) return null;
    await request.update(patch, options);
    return request;
  },

  async remove(id) {
    const deleted = await MaintenanceRequest.destroy({ where: { id } });
    return deleted > 0;
  },
};