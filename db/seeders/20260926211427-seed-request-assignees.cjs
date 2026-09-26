'use strict';
const { randomUUID } = require('node:crypto');

const TECHS = [
  'aaaaaaa1-0001-0000-0000-000000000001',
  'aaaaaaa2-0002-0000-0000-000000000002',
  'aaaaaaa3-0003-0000-0000-000000000003',
  'aaaaaaa4-0004-0000-0000-000000000004',
  'aaaaaaa5-0005-0000-0000-000000000005',
];

module.exports = {
  async up(queryInterface) {
    // Назначаем бригады на первые 6 заявок: 1 lead + 1 member
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