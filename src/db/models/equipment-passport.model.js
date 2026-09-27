import { DataTypes, Model } from 'sequelize';

export function initEquipmentPassport(sequelize) {
  class EquipmentPassport extends Model {
    static associate(models) {
      EquipmentPassport.belongsTo(models.Equipment, { foreignKey: 'equipmentId', as: 'equipment' });
    }
  }

  EquipmentPassport.init(
    {
      id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
      equipmentId: { type: DataTypes.UUID, allowNull: false, unique: true },
      manufacturer: { type: DataTypes.STRING(120), allowNull: false },
      model: { type: DataTypes.STRING(120), allowNull: false },
      ratedPowerKw: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      lastVerifiedAt: { type: DataTypes.DATE, allowNull: true },
    },
    {
      sequelize,
      modelName: 'EquipmentPassport',
      tableName: 'equipment_passports',
      underscored: true,
      timestamps: true,
    }
  );

  return EquipmentPassport;
}