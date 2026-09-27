import { DataTypes, Model } from 'sequelize';

export function initEquipment(sequelize) {
  class Equipment extends Model {
    static associate(models) {
      Equipment.belongsTo(models.Site, { foreignKey: 'siteId', as: 'site' });
      Equipment.hasOne(models.EquipmentPassport, { foreignKey: 'equipmentId', as: 'passport' });
      Equipment.hasMany(models.MaintenanceRequest, { foreignKey: 'equipmentId', as: 'requests' });
    }

    toJSON() {
      const values = { ...this.get() };
      values.location = { lat: values.lat, lon: values.lon };
      delete values.lat;
      delete values.lon;
      return values;
    }
  }

  Equipment.init(
    {
      id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
      siteId: { type: DataTypes.UUID, allowNull: true },
      name: { type: DataTypes.STRING(100), allowNull: false },
      type: {
        type: DataTypes.ENUM('turbine', 'inverter', 'sensor', 'substation'),
        allowNull: false,
      },
      serialNumber: { type: DataTypes.STRING(64), allowNull: false, unique: true },
      status: {
        type: DataTypes.ENUM('operational', 'maintenance', 'fault', 'decommissioned'),
        allowNull: false,
        defaultValue: 'operational',
      },
      installedAt: { type: DataTypes.DATE, allowNull: false },
      lat: { type: DataTypes.DOUBLE, allowNull: false },
      lon: { type: DataTypes.DOUBLE, allowNull: false },
    },
    {
      sequelize,
      modelName: 'Equipment',
      tableName: 'equipment',
      underscored: true,
      timestamps: true,
    }
  );

  return Equipment;
}