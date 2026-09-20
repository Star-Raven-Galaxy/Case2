import { equipmentService } from '../services/equipment.service.js';
import { weatherService } from '../services/weather.service.js';

export const equipmentController = {
  async list(req, res) {
    const result = await equipmentService.list(req.valid.query);
    res.json(result);
  },

  async getById(req, res) {
    const equipment = await equipmentService.getById(req.valid.params.id);
    res.json({ data: equipment });
  },

  async create(req, res) {
    const equipment = await equipmentService.create(req.valid.body);
    res
      .status(201)
      .location(`/api/equipment/${equipment.id}`)
      .json({ data: equipment });
  },

  async update(req, res) {
    const equipment = await equipmentService.update(
      req.valid.params.id,
      req.valid.body
    );
    res.json({ data: equipment });
  },

  async remove(req, res) {
    await equipmentService.remove(req.valid.params.id);
    res.status(204).send();
  },

  async getRequests(req, res) {
    const requests = await equipmentService.getRequests(req.valid.params.id);
    res.json({ data: requests });
  },

  async getWeather(req, res) {
    const equipment = await equipmentService.getById(req.valid.params.id);
    const result = await weatherService.getForecast(
      equipment.location.lat,
      equipment.location.lon
    );
    res.json({ data: result });
  },
};