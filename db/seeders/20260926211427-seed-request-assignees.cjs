'use strict';
const { randomUUID } = require('node:crypto');

const TECHS = [
  'aaaaaaaa-0001-4000-8000-000000000001',
  'aaaaaaaa-0002-4000-8000-000000000002',
  'aaaaaaaa-0003-4000-8000-000000000003',
  'aaaaaaaa-0004-4000-8000-000000000004',
  'aaaaaaaa-0005-4000-8000-000000000005',
];

module.exports = {
  async up(queryInterface) {
    const requests = await queryInterface.sequelize.query(
      `SELECT id FROM maintenance_requests ORDER BY created_at LIMIT 6`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const now = new Date();
    const rows = [];

    for (let i = 0; i < requests.length; i++) {
      const r = requests[i];
      rows.push({
        id: randomUUID(),
        request_id: r.id,
        technician_id: TECHS[i % TECHS.length],
        role: 'lead',
        hours: 8,
        created_at: now,
        updated_at: now,
      });
      rows.push({
        id: randomUUID(),
        request_id: r.id,
        technician_id: TECHS[(i + 1) % TECHS.length],
        role: 'member',
        hours: 6,
        created_at: now,
        updated_at: now,
      });
    }

    await queryInterface.bulkInsert('request_assignees', rows);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('request_assignees', null, {});
  },
};