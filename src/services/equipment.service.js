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
  const normalized = normalizeEquipmentPayload(payload);
  const existing = await equipmentRepository.findBySerialNumber(normalized.serialNumber);
  if (existing) throw new ConflictError('Серийный номер уже занят');
  return equipmentRepository.create(normalized);
},

async update(id, patch) {
  await this.getById(id);
  const normalized = normalizeEquipmentPayload(patch);

  if (normalized.serialNumber) {
    const existing = await equipmentRepository.findBySerialNumber(normalized.serialNumber);
    if (existing && existing.id !== id) {
      throw new ConflictError('Серийный номер уже занят');
    }
  }

  return equipmentRepository.update(id, normalized);
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
function normalizeEquipmentPayload(payload) {
  const normalized = { ...payload };
  if (payload.location && typeof payload.location === 'object') {
    normalized.lat = payload.location.lat;
    normalized.lon = payload.location.lon;
    delete normalized.location;
  }
  return normalized;
}