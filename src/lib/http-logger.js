import pinoHttp from 'pino-http';
import { randomUUID } from 'node:crypto';
import { logger } from './logger.js';

export const httpLogger = pinoHttp({
  logger,
  genReqId(req, res) {
    const existing = req.id ?? req.headers['x-request-id'];
    if (existing) return existing;
    const id = randomUUID();
    res.setHeader('X-Request-Id', id);
    return id;
  },
  customLogLevel(req, res, err) {
    if (err || res.statusCode >= 500) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },
  autoLogging: {
    ignore: (req) => req.url === '/api/health',
  },
});