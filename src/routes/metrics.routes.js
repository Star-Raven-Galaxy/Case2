import { Router } from 'express';
import { metricsRegistry } from '../lib/metrics.js';

export const metricsRouter = Router();

metricsRouter.get('/', async (req, res) => {
  res.set('Content-Type', metricsRegistry.contentType);
  res.end(await metricsRegistry.metrics());
});
