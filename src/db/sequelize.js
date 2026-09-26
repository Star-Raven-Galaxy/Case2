import { Sequelize } from 'sequelize';
import { config } from '../config/index.js';

export const sequelize = new Sequelize(
  config.db.database,
  config.db.username,
  config.db.password,
  {
    host: config.db.host,
    port: config.db.port,
    dialect: 'postgres',
    logging: config.db.logging,
    define: {
      underscored: true,
      timestamps: true,
    },
    pool: {
      max: config.db.poolMax,
      min: 0,
      idle: 10_000,
      acquire: 30_000,
    },
  }
);

export async function connectDb() {
  await sequelize.authenticate();
}

export async function closeDb() {
  await sequelize.close();
}