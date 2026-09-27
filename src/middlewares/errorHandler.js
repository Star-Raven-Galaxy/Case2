import { getLog } from '../lib/context.js';
import { config } from '../config/index.js';
import { mapSequelizeError } from '../errors/sequelize-errors.js';
export function errorHandler(err, req, res, next) {
  err = mapSequelizeError(err);
  if (res.headersSent) return next(err);

  const status = err.status ?? err.statusCode ?? 500;
  const isOperational = err.isOperational === true || status < 500;

  const log = req.log ?? getLog();
  log[status >= 500 ? 'error' : 'warn']({ err, status }, 'request failed');

  const body = {
    error: {
      code: err.code ?? 'INTERNAL_ERROR',
      message: isOperational || config.env !== 'production'
        ? err.message
        : 'Внутренняя ошибка сервера',
      requestId: req.id,
    },
  };

  if (err.details) body.error.details = err.details;

  res.status(status).json(body);
}