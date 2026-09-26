'use strict';

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    await queryInterface.bulkInsert('technicians', [
      { id: 'aaaaaaa1-0001-0000-0000-000000000001', full_name: 'Иванов Иван Иванович', specialization: 'Электромеханик', employee_number: 'EMP-001', created_at: now, updated_at: now },
      { id: 'aaaaaaa2-0002-0000-0000-000000000002', full_name: 'Петров Пётр Петрович', specialization: 'Инженер-энергетик', employee_number: 'EMP-002', created_at: now, updated_at: now },
      { id: 'aaaaaaa3-0003-0000-0000-000000000003', full_name: 'Сидоров Алексей Владимирович', specialization: 'Механик', employee_number: 'EMP-003', created_at: now, updated_at: now },
      { id: 'aaaaaaa4-0004-0000-0000-000000000004', full_name: 'Кузнецова Мария Сергеевна', specialization: 'Инженер КИПиА', employee_number: 'EMP-004', created_at: now, updated_at: now },
      { id: 'aaaaaaa5-0005-0000-0000-000000000005', full_name: 'Смирнов Дмитрий Олегович', specialization: 'Электромонтёр', employee_number: 'EMP-005', created_at: now, updated_at: now },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('technicians', {
      employee_number: ['EMP-001', 'EMP-002', 'EMP-003', 'EMP-004', 'EMP-005'],
    });
  },
};