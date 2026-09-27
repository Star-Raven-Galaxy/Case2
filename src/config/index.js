// src/config/index.js
import 'dotenv/config';

export const config = {
  port: Number(process.env.PORT) || 3000,
  env: process.env.NODE_ENV || 'development',
  logLevel: process.env.LOG_LEVEL || 'info',

  corsOrigins: (process.env.CORS_ORIGINS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),

  rateLimit: {
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
    max: Number(process.env.RATE_LIMIT_MAX) || 100,
  },

  weather: {
    apiUrl: process.env.WEATHER_API_URL,
    timeoutMs: Number(process.env.REQUEST_TIMEOUT_MS) || 5000,
    windThreshold: Number(process.env.WIND_THRESHOLD_MS) || 10,
  },
    db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || 'equipment',
    username: process.env.DB_USER || 'equipment',
    password: process.env.DB_PASSWORD || 'equipment',
    poolMax: Number(process.env.DB_POOL_MAX) || 10,
    logging: process.env.DB_LOGGING === 'true' ? console.log : false,
  },
};
