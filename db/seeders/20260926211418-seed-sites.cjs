'use strict';

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    await queryInterface.bulkInsert('sites', [
      {
        id: '11111111-1111-4111-8111-111111111111',
        name: 'Московская ВЭС',
        code: 'MOW-WPP-01',
        region: 'Москва',
        lat: 55.7558,
        lon: 37.6173,
        created_at: now,
        updated_at: now,
      },
      {
        id: '22222222-2222-4222-8222-222222222222',
        name: 'Казанская СЭС',
        code: 'KZN-SPP-02',
        region: 'Татарстан',
        lat: 55.7963,
        lon: 49.1088,
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('sites', {
      id: [
        '11111111-1111-4111-8111-111111111111',
        '22222222-2222-4222-8222-222222222222',
      ],
    });
  },
};