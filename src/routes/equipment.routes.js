import { Router } from 'express';
import { equipmentController } from '../controllers/equipment.controller.js';
import { validate } from '../middlewares/validate.js';
import { authenticate } from '../middlewares/authenticate.js';
import { authorize } from '../middlewares/authorize.js';
import {
  createEquipmentSchema,
  updateEquipmentSchema,
  listEquipmentSchema,
  idParamOnlySchema,
} from '../validators/equipment.schema.js';

export const equipmentRouter = Router();

equipmentRouter.use(authenticate);

equipmentRouter.get('/', validate(listEquipmentSchema), equipmentController.list);
equipmentRouter.get('/:id', validate(idParamOnlySchema), equipmentController.getById);
equipmentRouter.get('/:id/requests', validate(idParamOnlySchema), equipmentController.getRequests);
equipmentRouter.get('/:id/weather', validate(idParamOnlySchema), equipmentController.getWeather);

equipmentRouter.post('/', authorize('admin'), validate(createEquipmentSchema), equipmentController.create);
equipmentRouter.patch('/:id', authorize('admin'), validate(updateEquipmentSchema), equipmentController.update);
equipmentRouter.delete('/:id', authorize('admin'), validate(idParamOnlySchema), equipmentController.remove);
