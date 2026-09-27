import { reportsRepository } from '../repositories/reports.repository.js';

export const reportsService = {
  async equipmentLoad(query) {
    const from = query.from ?? null;
    const to = query.to ?? null;
    const minRequests = query.minRequests ?? 0;
    return reportsRepository.equipmentLoad({ from, to, minRequests });
  },
};
