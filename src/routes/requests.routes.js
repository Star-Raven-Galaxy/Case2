import { Router } from 'express';
import { requestsController } from '../controllers/requests.controller.js';
import { validate } from '../middlewares/validate.js';
import {
  createRequestSchema,
  updateRequestSchema,
  changeStatusSchema,
  listRequestsSchema,
  idParamOnlySchema,
} from '../validators/requests.schema.js';

export const requestsRouter = Router();

requestsRouter.get(
  '/',
  validate(listRequestsSchema),
  requestsController.list
);

requestsRouter.post(
  '/',
  validate(createRequestSchema),
  requestsController.create
);

requestsRouter.get(
  '/:id',
  validate(idParamOnlySchema),
  requestsController.getById
);

requestsRouter.patch(
  '/:id',
  validate(updateRequestSchema),
  requestsController.update
);

requestsRouter.patch(
  '/:id/status',
  validate(changeStatusSchema),
  requestsController.changeStatus
);

requestsRouter.delete(
  '/:id',
  validate(idParamOnlySchema),
  requestsController.remove
);