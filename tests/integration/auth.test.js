import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import { app } from '../../src/app.js';
import { createUser } from '../helpers.js';

describe('Auth (integration)', () => {
  it('POST /api/auth/register — создаёт пользователя (201)', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'new@example.com', password: 'Passw0rd!' });

    expect(res.status).toBe(201);
    expect(res.body.data.email).toBe('new@example.com');
    expect(res.body.data.passwordHash).toBeUndefined();
  });

  it('POST /api/auth/register — дубликат email → 409', async () => {
    await createUser({ email: 'dup@example.com' });
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'dup@example.com', password: 'Passw0rd!' });

    expect(res.status).toBe(409);
  });

  it('POST /api/auth/login — неверный пароль → 401', async () => {
    await createUser({ email: 'user@example.com' });
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'user@example.com', password: 'WrongPassword1' });

    expect(res.status).toBe(401);
    expect(res.body.error.message).toBe('Неверный email или пароль');
  });

  it('POST /api/auth/login — несуществующий email → то же 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@example.com', password: 'WrongPassword1' });

    expect(res.status).toBe(401);
    expect(res.body.error.message).toBe('Неверный email или пароль');
  });

  it('GET /api/auth/me — без токена → 401', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('GET /api/auth/me — с токеном → 200', async () => {
    await createUser({ email: 'me@example.com' });
    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: 'me@example.com', password: 'Passw0rd!' });
    const token = login.body.data.accessToken;

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe('me@example.com');
  });
});
