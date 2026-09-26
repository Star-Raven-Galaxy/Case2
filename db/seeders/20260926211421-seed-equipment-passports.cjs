'use strict';

const EQ = {
  T1: 'bbbbbbb1-0001-0000-0000-000000000001',
  T2: 'bbbbbbb2-0002-0000-0000-000000000002',
  I1: 'bbbbbbb3-0003-0000-0000-000000000003',
  T3: 'bbbbbbb4-0004-0000-0000-000000000004',
  I2: 'bbbbbbb5-0005-0000-0000-000000000005',
  D1: 'bbbbbbb6-0006-0000-0000-000000000006',
};

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    await queryInterface.bulkInsert('equipment_passports', [
      { id: 'ccccccc1-0001-0000-0000-000000000001', equipment_id: EQ.T1, manufacturer: 'Siemens', model: 'SWT-3.6-120', rated_power_kw: 3600, last_verified_at: new Date('2024-03-01'), created_at: now, updated_at: now },
      { id: 'ccccccc2-0002-0000-0000-000000000002', equipment_id: EQ.T2, manufacturer: 'Vestas', model: 'V150-4.2', rated_power_kw: 4200, last_verified_at: new Date('2024-04-15'), created_at: now, updated_at: now },
      { id: 'ccccccc3-0003-0000-0000-000000000003', equipment_id: EQ.I1, manufacturer: 'ABB', model: 'PVS980', rated_power_kw: 2500, last_verified_at: new Date('2024-02-20'), created_at: now, updated_at: now },
      { id: 'ccccccc4-0004-0000-0000-000000000004', equipment_id: EQ.T3, manufacturer: 'GE', model: 'Haliade-X', rated_power_kw: 12000, last_verified_at: new Date('2024-01-10'), created_at: now, updated_at: now },
      { id: 'ccccccc5-0005-0000-0000-000000000005', equipment_id: EQ.I2, manufacturer: 'Huawei', model: 'SUN2000', rated_power_kw: 100, last_verified_at: new Date('2024-05-05'), created_at: now, updated_at: now },
      { id: 'ccccccc6-0006-0000-0000-000000000006', equipment_id: EQ.D1, manufacturer: 'Endress+Hauser', model: 'Proline Promass', rated_power_kw: 1, last_verified_at: new Date('2024-06-01'), created_at: now, updated_at: now },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('equipment_passports', {
      equipment_id: [EQ.T1, EQ.T2, EQ.I1, EQ.T3, EQ.I2, EQ.D1],
    });
  },
};