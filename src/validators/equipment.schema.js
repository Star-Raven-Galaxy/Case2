import { z } from 'zod';
import { paginationSchema } from './common.schema.js';

const equipmentBody = z.strictObject({
  name: z.string().min(3).max(100),
  type: z.enum(['turbine', 'inverter', 'sensor', 'substation']),
  serialNumber: z.string().min(1),
  location: z.object({
    lat: z.number().min(-90).max(90),
    lon: z.number().min(-180).max(180),
  }),
  status: z.enum(['operational', 'maintenance', 'fault', 'decommissioned']),
  installedAt: z.iso.datetime().refine(
    (d) => new Date(d) <= new Date(),
    'Дата установки не может быть в будущем'
  ),
});

export const createEquipmentSchema = {
  body: equipmentBody,
};

export const updateEquipmentSchema = {
  body: equipmentBody.partial(),
  params: z.object({ id: z.uuid() }),
};

export const listEquipmentSchema = {
  query: paginationSchema.extend({
    type: z.enum(['turbine', 'inverter', 'sensor', 'substation']).optional(),
    status: z.enum(['operational', 'maintenance', 'fault', 'decommissioned']).optional(),
  }),
};

export const idParamOnlySchema = {
  params: z.object({ id: z.uuid() }),
};