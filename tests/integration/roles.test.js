import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import { app } from '../../src/app.js';
import { createUser, login } from '../helpers.js';

describe('Роли (integration)', () => {
  it('viewer не может создать equipment → 403', async () => {
    await createUser({ email: 'viewer@example.com', role: 'viewer' });
    const token = await login('viewer@example.com');

    const res = await request(app)
      .post('/api/equipment')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Turbine',
        type: 'turbine',
        serialNumber: 'SN-ROLES-1',
        location: { lat: 1, lon: 1 },
        status: 'operational',
        installedAt: '2024-01-01T00:00:00.000Z',
      });

    expect(res.status).toBe(403);
  });

  it('без токена → 401', async () => {
    const res = await request(app).get('/api/equipment');
    expect(res.status).toBe(401);
  });
});
