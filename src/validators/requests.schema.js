import { z } from 'zod';
import { paginationSchema } from './common.schema.js';

const requestBody = z.strictObject({
  equipmentId: z.uuid(),
  title: z.string().min(5).max(120),
  description: z.string().max(2000).optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  plannedAt: z.iso.datetime().optional(),
});

export const createRequestSchema = {
  body: requestBody,
};

export const updateRequestSchema = {
  body: requestBody.omit({ equipmentId: true }).partial(),
  params: z.object({ id: z.uuid() }),
};

export const changeStatusSchema = {
  body: z.strictObject({
    status: z.enum(['new', 'in_progress', 'done', 'rejected']),
  }),
  params: z.object({ id: z.uuid() }),
};

export const listRequestsSchema = {
  query: paginationSchema.extend({
    equipmentId: z.uuid().optional(),
    status: z.enum(['new', 'in_progress', 'done', 'rejected']).optional(),
    priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
    from: z.iso.datetime().optional(),
    to: z.iso.datetime().optional(),
  }),
};

export const idParamOnlySchema = {
  params: z.object({ id: z.uuid() }),
};

export const equipmentIdParamSchema = {
  params: z.object({ id: z.uuid() }),
};