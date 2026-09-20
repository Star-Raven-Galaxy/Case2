import { Router } from 'express';
import { equipmentRouter } from './equipment.routes.js';
import { requestsRouter } from './requests.routes.js';

export const apiRouter = Router();

apiRouter.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

apiRouter.use('/equipment', equipmentRouter);
apiRouter.use('/requests', requestsRouter);