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

export async function connectDb(retries = 10, delayMs = 3000) {
  for (let i = 1; i <= retries; i++) {
    try {
      await sequelize.authenticate();
      return;
    } catch (err) {
      if (i === retries) throw err;
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
}

export async function closeDb() {
  await sequelize.close();
}
