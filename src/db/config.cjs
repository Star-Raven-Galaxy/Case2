const path = require('node:path');

require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

const base = {
  username: process.env.DB_USER || 'equipment',
  password: process.env.DB_PASSWORD || 'equipment',
  database: process.env.DB_NAME || 'equipment',
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 5434,
  dialect: 'postgres',
  define: { underscored: true },
  logging: process.env.DB_LOGGING === 'true' ? console.log : false,
};

module.exports = {
  development: base,
  test: { ...base, database: `${base.database}_test` },
  production: base,
};