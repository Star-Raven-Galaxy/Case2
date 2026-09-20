import { randomUUID } from 'node:crypto';
import { store } from '../data/store.js';

const SORTABLE = ['title', 'priority', 'status', 'createdAt', 'plannedAt'];
const OPEN_STATUSES = ['new', 'in_progress'];

export const requestsRepository = {
  async findAll({ equipmentId, status, priority, page = 1, limit = 10, sort = 'createdAt', order = 'desc', from, to }) {
    let items = [...store.requests.values()];

    if (equipmentId) items = items.filter((r) => r.equipmentId === equipmentId);
    if (status) items = items.filter((r) => r.status === status);
    if (priority) items = items.filter((r) => r.priority === priority);
    if (from) items = items.filter((r) => r.createdAt >= from);
    if (to) items = items.filter((r) => r.createdAt <= to);

    const field = SORTABLE.includes(sort) ? sort : 'createdAt';
    const dir = order === 'asc' ? 1 : -1;
    items.sort((a, b) =>
      String(a[field]).localeCompare(String(b[field])) * dir
    );

    const total = items.length;
    const start = (page - 1) * limit;
    const data = items.slice(start, start + limit);

    return { data, total, page, limit };
  },

  async findById(id) {
    return store.requests.get(id) || null;
  },

  async findByEquipmentId(equipmentId) {
    return [...store.requests.values()].filter(
      (r) => r.equipmentId === equipmentId
    );
  },

  async findOpenByEquipmentId(equipmentId) {
    return [...store.requests.values()].filter(
      (r) => r.equipmentId === equipmentId && OPEN_STATUSES.includes(r.status)
    );
  },

  async create(data) {
    const now = new Date().toISOString();
    const request = {
      id: randomUUID(),
      ...data,
      status: 'new',
      createdAt: now,
      updatedAt: now,
    };
    store.requests.set(request.id, request);
    return request;
  },

  async update(id, patch) {
    const existing = store.requests.get(id);
    if (!existing) return null;

    const updated = {
      ...existing,
      ...patch,
      id: existing.id,
      equipmentId: existing.equipmentId,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    };
    store.requests.set(id, updated);
    return updated;
  },

  async remove(id) {
    return store.requests.delete(id);
  },
};