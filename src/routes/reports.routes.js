import { Router } from 'express';
import { z } from 'zod';
import { reportsController } from '../controllers/reports.controller.js';
import { validate } from '../middlewares/validate.js';

export const reportsRouter = Router();

reportsRouter.get(
  '/equipment-load',
  validate({
    query: z.object({
      from: z.iso.datetime().optional(),
      to: z.iso.datetime().optional(),
      minRequests: z.coerce.number().int().min(0).max(1000).optional(),
    }),
  }),
  reportsController.equipmentLoad
);
