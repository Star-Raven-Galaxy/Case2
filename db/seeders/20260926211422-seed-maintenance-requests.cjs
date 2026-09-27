'use strict';
const { randomUUID } = require('node:crypto');

const EQ = {
  T1: 'bbbbbbbb-0001-4000-8000-000000000001',
  T2: 'bbbbbbbb-0002-4000-8000-000000000002',
  I1: 'bbbbbbbb-0003-4000-8000-000000000003',
  T3: 'bbbbbbbb-0004-4000-8000-000000000004',
  I2: 'bbbbbbbb-0005-4000-8000-000000000005',
  D1: 'bbbbbbbb-0006-4000-8000-000000000006',
};

module.exports = {
  async up(queryInterface) {
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;
    const d = (offsetDays) => new Date(now + offsetDays * day);

    const rows = [];
    const statuses = ['new', 'in_progress', 'done', 'rejected'];
    const priorities = ['low', 'medium', 'high', 'critical'];
    const equipmentIds = [EQ.T1, EQ.T2, EQ.I1, EQ.T3, EQ.I2, EQ.D1];

    for (let i = 1; i <= 20; i++) {
      const status = statuses[i % 4];
      const priority = priorities[i % 4];
      const equipmentId = equipmentIds[i % 6];
      rows.push({
        id: randomUUID(),
        equipment_id: equipmentId,
        title: `Заявка №${i}: плановое обслуживание`,
        description: `Описание заявки №${i} для демонстрации.`,
        priority,
        status,
        planned_at: d(i),
        closed_at: status === 'done' ? d(i + 1) : null,
        author: 'system',
        created_at: d(-i),
        updated_at: d(-i),
      });
    }

    await queryInterface.bulkInsert('maintenance_requests', rows);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('maintenance_requests', { author: 'system' });
  },
};