import { sitesService } from '../services/sites.service.js';

export const sitesController = {
  async summary(req, res) {
    const summary = await sitesService.summary(req.valid.params.id);
    res.json({ data: summary });
  },
};
