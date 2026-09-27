import { Router } from 'express';
import { z } from 'zod';
import { sitesController } from '../controllers/sites.controller.js';
import { validate } from '../middlewares/validate.js';

export const sitesRouter = Router();

sitesRouter.get(
  '/:id/summary',
  validate({ params: z.object({ id: z.uuid() }) }),
  sitesController.summary
);
