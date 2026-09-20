
import { requestsService } from '../services/requests.service.js';

export const requestsController = {
  async list(req, res) {
    const result = await requestsService.list(req.valid.query);
    res.json(result);
  },

  async getById(req, res) {
    const request = await requestsService.getById(req.valid.params.id);
    res.json({ data: request });
  },

  async create(req, res) {
    const request = await requestsService.create(req.valid.body);
    res
      .status(201)
      .location(`/api/requests/${request.id}`)
      .json({ data: request });
  },

  async update(req, res) {
    const request = await requestsService.update(
      req.valid.params.id,
      req.valid.body
    );
    res.json({ data: request });
  },

  async changeStatus(req, res) {
    const request = await requestsService.changeStatus(
      req.valid.params.id,
      req.valid.body.status
    );
    res.json({ data: request });
  },

  async remove(req, res) {
    await requestsService.remove(req.valid.params.id);
    res.status(204).send();
  },
};