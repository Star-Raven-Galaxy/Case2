import { Router } from 'express';
import { equipmentRouter } from './equipment.routes.js';
import { requestsRouter } from './requests.routes.js';
import { sitesRouter } from './sites.routes.js';
import { reportsRouter } from './reports.routes.js';
import { authRouter } from './auth.routes.js';

export const apiRouter = Router();

apiRouter.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

apiRouter.use('/auth', authRouter);
apiRouter.use('/equipment', equipmentRouter);
apiRouter.use('/requests', requestsRouter);
apiRouter.use('/sites', sitesRouter);
apiRouter.use('/reports', reportsRouter);
