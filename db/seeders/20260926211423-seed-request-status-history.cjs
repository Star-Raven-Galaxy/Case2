'use strict';
const { randomUUID } = require('node:crypto');

module.exports = {
  async up(queryInterface) {
    const requests = await queryInterface.sequelize.query(
      `SELECT id, status FROM maintenance_requests ORDER BY created_at LIMIT 6`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const now = new Date();
    const rows = [];

    for (const r of requests) {
      rows.push({
        id: randomUUID(),
        request_id: r.id,
        old_status: null,
        new_status: 'new',
        changed_by: 'system',
        comment: 'Заявка создана',
        created_at: now,
      });

      if (r.status === 'in_progress' || r.status === 'done') {
        rows.push({
          id: randomUUID(),
          request_id: r.id,
          old_status: 'new',
          new_status: 'in_progress',
          changed_by: 'system',
          comment: 'Взята в работу',
          created_at: new Date(now.getTime() + 1000),
        });
      }

      if (r.status === 'done') {
        rows.push({
          id: randomUUID(),
          request_id: r.id,
          old_status: 'in_progress',
          new_status: 'done',
          changed_by: 'system',
          comment: 'Работа завершена',
          created_at: new Date(now.getTime() + 2000),
        });
      }
    }

    if (rows.length > 0) {
      await queryInterface.bulkInsert('request_status_history', rows);
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('request_status_history', null, {});
  },
};