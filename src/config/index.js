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
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 5434,
    database: process.env.DB_NAME || 'equipment',
    username: process.env.DB_USER || 'equipment',
    password: process.env.DB_PASSWORD || 'equipment',
    poolMax: Number(process.env.DB_POOL_MAX) || 10,
    logging: process.env.DB_LOGGING === 'true' ? console.log : false,
  },

  auth: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessTtl: process.env.JWT_ACCESS_TTL || '15m',
    refreshTtl: process.env.JWT_REFRESH_TTL || '7d',
    bcryptRounds: Number(process.env.BCRYPT_ROUNDS) || 10,
    cookieSecure: process.env.COOKIE_SECURE === 'true',
    cookieSameSite: process.env.COOKIE_SAMESITE || 'lax',
    loginRateLimit: {
      windowMs: Number(process.env.LOGIN_RATE_LIMIT_WINDOW_MS) || 60000,
      max: Number(process.env.LOGIN_RATE_LIMIT_MAX) || 10,
    },
  },

  trustProxy: process.env.TRUST_PROXY === '1' || process.env.TRUST_PROXY === 'true',
};