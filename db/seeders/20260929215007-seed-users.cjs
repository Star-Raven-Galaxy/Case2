'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface) {
    const rounds = Number(process.env.BCRYPT_ROUNDS) || 10;
    const now = new Date();
    const passwordHash = await bcrypt.hash('Passw0rd!', rounds);

    await queryInterface.bulkInsert('users', [
      {
        id: '11111111-aaaa-4111-8111-000000000001',
        email: 'admin@example.com',
        password_hash: passwordHash,
        role: 'admin',
        technician_id: null,
        is_active: true,
        last_login_at: null,
        created_at: now,
        updated_at: now,
      },
      {
        id: '11111111-aaaa-4111-8111-000000000002',
        email: 'tech@example.com',
        password_hash: passwordHash,
        role: 'technician',
        technician_id: 'aaaaaaaa-0001-4000-8000-000000000001',
        is_active: true,
        last_login_at: null,
        created_at: now,
        updated_at: now,
      },
      {
        id: '11111111-aaaa-4111-8111-000000000003',
        email: 'viewer@example.com',
        password_hash: passwordHash,
        role: 'viewer',
        technician_id: null,
        is_active: true,
        last_login_at: null,
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', {
      email: ['admin@example.com', 'tech@example.com', 'viewer@example.com'],
    });
  },
};