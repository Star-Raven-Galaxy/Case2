import { Router } from 'express';
import { equipmentController } from '../controllers/equipment.controller.js';
import { validate } from '../middlewares/validate.js';
import {
  createEquipmentSchema,
  updateEquipmentSchema,
  listEquipmentSchema,
  idParamOnlySchema,
} from '../validators/equipment.schema.js';

export const equipmentRouter = Router();

equipmentRouter.get(
  '/',
  validate(listEquipmentSchema),
  equipmentController.list
);

equipmentRouter.post(
  '/',
  validate(createEquipmentSchema),
  equipmentController.create
);

equipmentRouter.get(
  '/:id',
  validate(idParamOnlySchema),
  equipmentController.getById
);

equipmentRouter.patch(
  '/:id',
  validate(updateEquipmentSchema),
  equipmentController.update
);

equipmentRouter.delete(
  '/:id',
  validate(idParamOnlySchema),
  equipmentController.remove
);

equipmentRouter.get(
  '/:id/requests',
  validate(idParamOnlySchema),
  equipmentController.getRequests
);

equipmentRouter.get(
  '/:id/weather',
  validate(idParamOnlySchema),
  equipmentController.getWeather
);