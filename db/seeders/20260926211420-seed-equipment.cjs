'use strict';

const SITE_MOW = '11111111-1111-1111-1111-111111111111';
const SITE_KZN = '22222222-2222-2222-2222-222222222222';

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    await queryInterface.bulkInsert('equipment', [
      { id: 'bbbbbbb1-0001-0000-0000-000000000001', site_id: SITE_MOW, name: 'Турбина Т-1', type: 'turbine', serial_number: 'TURB-MOW-001', status: 'operational', installed_at: new Date('2023-05-10'), lat: 55.7558, lon: 37.6173, created_at: now, updated_at: now },
      { id: 'bbbbbbb2-0002-0000-0000-000000000002', site_id: SITE_MOW, name: 'Турбина Т-2', type: 'turbine', serial_number: 'TURB-MOW-002', status: 'maintenance', installed_at: new Date('2023-06-15'), lat: 55.756, lon: 37.618, created_at: now, updated_at: now },
      { id: 'bbbbbbb3-0003-0000-0000-000000000003', site_id: SITE_MOW, name: 'Инвертор И-1', type: 'inverter', serial_number: 'INV-MOW-001', status: 'operational', installed_at: new Date('2023-07-20'), lat: 55.757, lon: 37.619, created_at: now, updated_at: now },
      { id: 'bbbbbbb4-0004-0000-0000-000000000004', site_id: SITE_KZN, name: 'Турбина Т-3', type: 'turbine', serial_number: 'TURB-KZN-001', status: 'fault', installed_at: new Date('2023-08-05'), lat: 55.7963, lon: 49.1088, created_at: now, updated_at: now },
      { id: 'bbbbbbb5-0005-0000-0000-000000000005', site_id: SITE_KZN, name: 'Инвертор И-2', type: 'inverter', serial_number: 'INV-KZN-001', status: 'operational', installed_at: new Date('2023-09-12'), lat: 55.797, lon: 49.109, created_at: now, updated_at: now },
      { id: 'bbbbbbb6-0006-0000-0000-000000000006', site_id: SITE_KZN, name: 'Датчик Д-1', type: 'sensor', serial_number: 'SENS-KZN-001', status: 'operational', installed_at: new Date('2023-10-01'), lat: 55.798, lon: 49.11, created_at: now, updated_at: now },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('equipment', {
      serial_number: ['TURB-MOW-001', 'TURB-MOW-002', 'INV-MOW-001', 'TURB-KZN-001', 'INV-KZN-001', 'SENS-KZN-001'],
    });
  },
};