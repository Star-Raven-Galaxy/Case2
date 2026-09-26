import { DataTypes, Model } from 'sequelize';

export function initSite(sequelize) {
  class Site extends Model {
    static associate(models) {
      Site.hasMany(models.Equipment, { foreignKey: 'siteId', as: 'equipment' });
    }
  }

  Site.init(
    {
      id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
      name: { type: DataTypes.STRING(120), allowNull: false },
      code: { type: DataTypes.STRING(32), allowNull: false, unique: true },
      region: { type: DataTypes.STRING(80), allowNull: false },
      lat: { type: DataTypes.DOUBLE, allowNull: false },
      lon: { type: DataTypes.DOUBLE, allowNull: false },
    },
    {
      sequelize,
      modelName: 'Site',
      tableName: 'sites',
      underscored: true,
      timestamps: true,
    }
  );

  return Site;
}