import 'dotenv/config';
import { sequelize } from '../src/db/index.js';
import { sequelize as sequelizeConfig } from '../src/db/sequelize.js';

// подменяем БД на тестовую через env
process.env.DB_NAME = process.env.DB_NAME_TEST || 'equipment_test';

beforeAll(async () => {
  await sequelize.authenticate();
});

afterEach(async () => {
  // очистка таблиц между тестами
  await sequelize.query(
    'TRUNCATE request_status_history, request_assignees, maintenance_requests, equipment_passports, equipment, technicians, users, sites RESTART IDENTITY CASCADE;'
  );
});

afterAll(async () => {
  await sequelize.close();
});
