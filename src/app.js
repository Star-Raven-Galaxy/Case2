import express from 'express';
import { httpLogger } from './lib/http-logger.js';
import { contextMiddleware } from './lib/context.js';
import { apiRouter } from './routes/index.js';
import { notFound } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';

export const app = express();

app.use(httpLogger);
app.use(contextMiddleware);
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

app.use('/api', apiRouter);
app.use(notFound);
app.use(errorHandler);