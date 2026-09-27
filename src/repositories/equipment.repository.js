import { Equipment, Site, EquipmentPassport } from '../db/index.js';

const SORTABLE = ['name', 'serialNumber', 'installedAt', 'status', 'type'];

export const equipmentRepository = {
  async findAll({ type, status, page = 1, limit = 10, sort = 'name', order = 'asc' }) {
    const field = SORTABLE.includes(sort) ? sort : 'name';
    const dir = order === 'desc' ? 'DESC' : 'ASC';

    const where = {};
    if (type) where.type = type;
    if (status) where.status = status;

    const { rows, count } = await Equipment.findAndCountAll({
      where,
      include: [
        { model: Site, as: 'site', attributes: ['id', 'name', 'code', 'region'] },
        {
          model: EquipmentPassport,
          as: 'passport',
          attributes: ['id', 'manufacturer', 'model', 'ratedPowerKw', 'lastVerifiedAt'],
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
    return Equipment.findByPk(id, {
      include: [
        { model: Site, as: 'site' },
        { model: EquipmentPassport, as: 'passport' },
      ],
    });
  },

  async findBySerialNumber(serialNumber) {
    return Equipment.findOne({ where: { serialNumber } });
  },

  async create(data) {
    return Equipment.create(data);
  },

  async update(id, patch) {
    const equipment = await Equipment.findByPk(id);
    if (!equipment) return null;
    await equipment.update(patch);
    return equipment;
  },

  async remove(id) {
    const deleted = await Equipment.destroy({ where: { id } });
    return deleted > 0;
  },
};