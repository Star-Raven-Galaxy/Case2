import { reportsService } from '../services/reports.service.js';

export const reportsController = {
  async equipmentLoad(req, res) {
    const items = await reportsService.equipmentLoad(req.valid.query);
    res.json({ data: items });
  },
};
