import { DataTypes, Model } from 'sequelize';

export function initMaintenanceRequest(sequelize) {
  class MaintenanceRequest extends Model {
    static associate(models) {
      MaintenanceRequest.belongsTo(models.Equipment, { foreignKey: 'equipmentId', as: 'equipment' });
      MaintenanceRequest.hasMany(models.RequestStatusHistory, { foreignKey: 'requestId', as: 'history' });
      MaintenanceRequest.belongsToMany(models.Technician, {
        through: models.RequestAssignee,
        foreignKey: 'requestId',
        otherKey: 'technicianId',
        as: 'technicians',
      });
      MaintenanceRequest.hasMany(models.RequestAssignee, { foreignKey: 'requestId', as: 'assignees' });
    }
  }

  MaintenanceRequest.init(
    {
      id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
      equipmentId: { type: DataTypes.UUID, allowNull: false },
      title: { type: DataTypes.STRING(120), allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      priority: {
        type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('new', 'in_progress', 'done', 'rejected'),
        allowNull: false,
        defaultValue: 'new',
      },
      plannedAt: { type: DataTypes.DATE, allowNull: true },
      closedAt: { type: DataTypes.DATE, allowNull: true },
      author: { type: DataTypes.STRING(120), allowNull: false, defaultValue: 'system' },
    },
    {
      sequelize,
      modelName: 'MaintenanceRequest',
      tableName: 'maintenance_requests',
      underscored: true,
      timestamps: true,
    }
  );

  return MaintenanceRequest;
}