import { Router } from 'express';
import { requestsController } from '../controllers/requests.controller.js';
import { validate } from '../middlewares/validate.js';
import { authenticate } from '../middlewares/authenticate.js';
import { authorize } from '../middlewares/authorize.js';
import {
  createRequestSchema,
  updateRequestSchema,
  changeStatusSchema,
  listRequestsSchema,
  idParamOnlySchema,
  assignSchema,
  unassignSchema,
} from '../validators/requests.schema.js';

export const requestsRouter = Router();

requestsRouter.use(authenticate);

requestsRouter.get('/', validate(listRequestsSchema), requestsController.list);
requestsRouter.get('/:id', validate(idParamOnlySchema), requestsController.getById);
requestsRouter.get('/:id/history', validate(idParamOnlySchema), requestsController.history);

requestsRouter.post('/', authorize('technician', 'admin'), validate(createRequestSchema), requestsController.create);
requestsRouter.patch('/:id', authorize('technician', 'admin'), validate(updateRequestSchema), requestsController.update);
requestsRouter.patch('/:id/status', authorize('technician', 'admin'), validate(changeStatusSchema), requestsController.changeStatus);

requestsRouter.post('/:id/assignees', authorize('admin'), validate(assignSchema), requestsController.assign);
requestsRouter.delete('/:id/assignees/:userId', authorize('admin'), validate(unassignSchema), requestsController.unassign);

requestsRouter.delete('/:id', authorize('admin'), validate(idParamOnlySchema), requestsController.remove);
