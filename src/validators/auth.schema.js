import { z } from 'zod';

const email = z.string().email().max(150);
const password = z.string().min(8).max(100);

export const registerSchema = {
  body: z.strictObject({
    email,
    password,
    role: z.enum(['viewer', 'technician', 'admin']).optional(),
    technicianId: z.uuid().nullable().optional(),
  }),
};

export const loginSchema = {
  body: z.strictObject({
    email,
    password,
  }),
};

export const logoutSchema = {};
