'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Снимаем FK
    await queryInterface.removeConstraint('equipment', 'equipment_site_id_fkey');

    // 2. Меняем колонку на nullable
    await queryInterface.changeColumn('equipment', 'site_id', {
      type: Sequelize.UUID,
      allowNull: true,
    });

    // 3. Возвращаем FK с ON DELETE SET NULL
    await queryInterface.addConstraint('equipment', {
      fields: ['site_id'],
      type: 'foreign key',
      name: 'equipment_site_id_fkey',
      references: { table: 'sites', field: 'id' },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('equipment', 'equipment_site_id_fkey');
    await queryInterface.changeColumn('equipment', 'site_id', {
      type: Sequelize.UUID,
      allowNull: false,
    });
    await queryInterface.addConstraint('equipment', {
      fields: ['site_id'],
      type: 'foreign key',
      name: 'equipment_site_id_fkey',
      references: { table: 'sites', field: 'id' },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    });
  },
};