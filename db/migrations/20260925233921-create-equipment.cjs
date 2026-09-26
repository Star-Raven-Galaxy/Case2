'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('equipment', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      site_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'sites', key: 'id' },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      },
      name: { type: Sequelize.STRING(100), allowNull: false },
      type: {
        type: Sequelize.ENUM('turbine', 'inverter', 'sensor', 'substation'),
        allowNull: false,
      },
      serial_number: {
        type: Sequelize.STRING(64),
        allowNull: false,
        unique: true,
      },
      status: {
        type: Sequelize.ENUM('operational', 'maintenance', 'fault', 'decommissioned'),
        allowNull: false,
        defaultValue: 'operational',
      },
      installed_at: { type: Sequelize.DATE, allowNull: false },
      lat: { type: Sequelize.DOUBLE, allowNull: false },
      lon: { type: Sequelize.DOUBLE, allowNull: false },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('equipment');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_equipment_type";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_equipment_status";');
  },
};