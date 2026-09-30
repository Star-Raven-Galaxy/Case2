import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';

import { config } from './config/index.js';
import { httpLogger } from './lib/http-logger.js';
import { contextMiddleware } from './lib/context.js';
import { metricsMiddleware } from './middlewares/metrics.js';
import { apiRouter } from './routes/index.js';
import { metricsRouter } from './routes/metrics.routes.js';
import { notFound } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';

export const app = express();

app.set('trust proxy', config.trustProxy ? 1 : false);
app.disable('x-powered-by');

app.use(httpLogger);
app.use(contextMiddleware);

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (config.corsOrigins.includes(origin)) return callback(null, true);
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
    exposedHeaders: ['X-Request-Id'],
    maxAge: 86400,
  })
);

app.use(metricsMiddleware);

app.use(
  '/api',
  rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: { code: 'RATE_LIMIT', message: 'Слишком много запросов' } },
  })
);

app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));
app.use(cookieParser());

app.use('/metrics', metricsRouter);
app.use('/api', apiRouter);
app.use(notFound);
app.use(errorHandler);