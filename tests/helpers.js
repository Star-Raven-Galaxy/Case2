import request from 'supertest';
import bcrypt from 'bcrypt';
import { app } from '../src/app.js';
import { usersRepository } from '../src/repositories/users.repository.js';
import { config } from '../src/config/index.js';

export async function createUser({
  email,
  password = 'Passw0rd!',
  role = 'viewer',
  technicianId = null,
}) {
  const passwordHash = await bcrypt.hash(password, config.auth.bcryptRounds);
  return usersRepository.create({ email, passwordHash, role, technicianId });
}

export async function login(email, password = 'Passw0rd!') {
  const res = await request(app).post('/api/auth/login').send({ email, password });
  return res.body.data.accessToken;
}

export function authHeader(token) {
  return { Authorization: `Bearer ${token}` };
}

export { request, app };
