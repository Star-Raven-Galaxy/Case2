import { randomUUID } from 'node:crypto';
import { store } from '../data/store.js';

const SORTABLE = ['name', 'serialNumber', 'installedAt', 'status', 'type'];

export const equipmentRepository = {
  async findAll({ type, status, page = 1, limit = 10, sort = 'name', order = 'asc' }) {
    let items = [...store.equipment.values()];

    if (type) items = items.filter((e) => e.type === type);
    if (status) items = items.filter((e) => e.status === status);

    const field = SORTABLE.includes(sort) ? sort : 'name';
    const dir = order === 'desc' ? -1 : 1;
    items.sort((a, b) =>
      String(a[field]).localeCompare(String(b[field])) * dir
    );

    const total = items.length;
    const start = (page - 1) * limit;
    const data = items.slice(start, start + limit);

    return { data, total, page, limit };
  },

  async findById(id) {
    return store.equipment.get(id) || null;
  },

  async findBySerialNumber(serialNumber) {
    return [...store.equipment.values()].find(
      (e) => e.serialNumber === serialNumber
    ) || null;
  },

  async create(data) {
    const now = new Date().toISOString();
    const equipment = {
      id: randomUUID(),
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    store.equipment.set(equipment.id, equipment);
    return equipment;
  },

  async update(id, patch) {
    const existing = store.equipment.get(id);
    if (!existing) return null;

    const updated = {
      ...existing,
      ...patch,
      id: existing.id,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    };
    store.equipment.set(id, updated);
    return updated;
  },

  async remove(id) {
    return store.equipment.delete(id);
  },
};