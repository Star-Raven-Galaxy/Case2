import { AsyncLocalStorage } from 'node:async_hooks';
import { logger } from './logger.js';

export const store = new AsyncLocalStorage();

export const contextMiddleware = (req, res, next) => {
  store.run({ reqId: req.id, log: req.log }, next);
};

export const getLog = () => store.getStore()?.log ?? logger;