import { sequelize } from '../src/db/index.js';

beforeAll(async () => {
  await sequelize.authenticate();
});

afterEach(async () => {
  await sequelize.query(
    'TRUNCATE request_status_history, request_assignees, maintenance_requests, equipment_passports, equipment, technicians, users, sites RESTART IDENTITY CASCADE;'
  );
});

afterAll(async () => {
  await sequelize.close();
});
