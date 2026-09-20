import { equipmentRepository } from '../repositories/equipment.repository.js';
import { requestsRepository } from '../repositories/requests.repository.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { ConflictError } from '../errors/ConflictError.js';

export const equipmentService = {
  async list(query) {
    return equipmentRepository.findAll(query);
  },

  async getById(id) {
    const equipment = await equipmentRepository.findById(id);
    if (!equipment) throw new NotFoundError('Оборудование');
    return equipment;
  },

  async create(payload) {
    const existing = await equipmentRepository.findBySerialNumber(payload.serialNumber);
    if (existing) throw new ConflictError('Серийный номер уже занят');
    return equipmentRepository.create(payload);
  },

  async update(id, patch) {
    await this.getById(id);

    if (patch.serialNumber) {
      const existing = await equipmentRepository.findBySerialNumber(patch.serialNumber);
      if (existing && existing.id !== id) {
        throw new ConflictError('Серийный номер уже занят');
      }
    }

    return equipmentRepository.update(id, patch);
  },

  async remove(id) {
    await this.getById(id);

    const openRequests = await requestsRepository.findOpenByEquipmentId(id);
    if (openRequests.length > 0) {
      throw new ConflictError('Нельзя удалить оборудование с открытыми заявками');
    }

    await equipmentRepository.remove(id);
  },

  async getRequests(id) {
    await this.getById(id);
    return requestsRepository.findByEquipmentId(id);
  },
};