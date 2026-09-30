import { Router } from 'express';
import { sequelize } from '../db/index.js';

export const healthRouter = Router();

healthRouter.get('/live', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

healthRouter.get('/ready', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ status: 'ready', db: 'up', timestamp: new Date().toISOString() });
  } catch (err) {
    req.log?.error({ err }, 'readiness check failed');
    res.status(503).json({ status: 'not_ready', db: 'down' });
  }
});
