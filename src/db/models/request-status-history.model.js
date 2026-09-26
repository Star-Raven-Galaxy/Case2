import { DataTypes, Model } from 'sequelize';

export function initRequestStatusHistory(sequelize) {
  class RequestStatusHistory extends Model {
    static associate(models) {
      RequestStatusHistory.belongsTo(models.MaintenanceRequest, {
        foreignKey: 'requestId',
        as: 'request',
      });
    }
  }

  RequestStatusHistory.init(
    {
      id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
      requestId: { type: DataTypes.UUID, allowNull: false },
      oldStatus: {
        type: DataTypes.ENUM('new', 'in_progress', 'done', 'rejected'),
        allowNull: true,
      },
      newStatus: {
        type: DataTypes.ENUM('new', 'in_progress', 'done', 'rejected'),
        allowNull: false,
      },
      changedBy: { type: DataTypes.STRING(120), allowNull: false, defaultValue: 'system' },
      comment: { type: DataTypes.TEXT, allowNull: true },
    },
    {
      sequelize,
      modelName: 'RequestStatusHistory',
      tableName: 'request_status_history',
      underscored: true,
      timestamps: true,
      updatedAt: false, // append-only
    }
  );

  return RequestStatusHistory;
}