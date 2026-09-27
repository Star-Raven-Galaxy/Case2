import { DataTypes, Model } from 'sequelize';

export function initTechnician(sequelize) {
  class Technician extends Model {
    static associate(models) {
      Technician.belongsToMany(models.MaintenanceRequest, {
        through: models.RequestAssignee,
        foreignKey: 'technicianId',
        otherKey: 'requestId',
        as: 'requests',
      });
    }
  }

  Technician.init(
    {
      id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
      fullName: { type: DataTypes.STRING(150), allowNull: false },
      specialization: { type: DataTypes.STRING(100), allowNull: false },
      employeeNumber: { type: DataTypes.STRING(32), allowNull: false, unique: true },
    },
    {
      sequelize,
      modelName: 'Technician',
      tableName: 'technicians',
      underscored: true,
      timestamps: true,
    }
  );

  return Technician;
}