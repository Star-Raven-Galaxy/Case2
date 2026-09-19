
import pino from 'pino';
import { config } from '../config/index.js';

export const logger = pino({

  level: config.logLevel,


  redact: [
    'req.headers.authorization',
    'req.headers.cookie',
    '*.password',
    '*.token',
  ],


  ...(config.env !== 'production' && {
    transport: { target: 'pino-pretty' },
  }),
});