import { DataTypes, Model } from 'sequelize';

export function initRequestAssignee(sequelize) {
  class RequestAssignee extends Model {
    static associate(models) {
      RequestAssignee.belongsTo(models.MaintenanceRequest, { foreignKey: 'requestId', as: 'request' });
      RequestAssignee.belongsTo(models.Technician, { foreignKey: 'technicianId', as: 'technician' });
    }
  }

  RequestAssignee.init(
    {
      id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
      requestId: { type: DataTypes.UUID, allowNull: false },
      technicianId: { type: DataTypes.UUID, allowNull: false },
      role: { type: DataTypes.ENUM('lead', 'member'), allowNull: false },
      hours: { type: DataTypes.DECIMAL(6, 2), allowNull: false, defaultValue: 0 },
    },
    {
      sequelize,
      modelName: 'RequestAssignee',
      tableName: 'request_assignees',
      underscored: true,
      timestamps: true,
      indexes: [{ unique: true, fields: ['request_id', 'technician_id'] }],
    }
  );

  return RequestAssignee;
}