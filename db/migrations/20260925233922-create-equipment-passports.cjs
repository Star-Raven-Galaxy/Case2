'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('equipment_passports', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      equipment_id: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
        references: { model: 'equipment', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      manufacturer: { type: Sequelize.STRING(120), allowNull: false },
      model: { type: Sequelize.STRING(120), allowNull: false },
      rated_power_kw: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      last_verified_at: { type: Sequelize.DATE, allowNull: true },
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
    await queryInterface.dropTable('equipment_passports');
  },
};