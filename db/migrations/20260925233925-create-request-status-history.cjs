'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('request_status_history', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      request_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'maintenance_requests', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      old_status: {
        type: Sequelize.ENUM('new', 'in_progress', 'done', 'rejected'),
        allowNull: true,
      },
      new_status: {
        type: Sequelize.ENUM('new', 'in_progress', 'done', 'rejected'),
        allowNull: false,
      },
      changed_by: {
        type: Sequelize.STRING(120),
        allowNull: false,
        defaultValue: 'system',
      },
      comment: { type: Sequelize.TEXT, allowNull: true },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('request_status_history');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_request_status_history_old_status";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_request_status_history_new_status";');
  },
};