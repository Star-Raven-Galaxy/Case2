import { AppError } from './AppError.js';

export class NotFoundError extends AppError {
  constructor(what = 'Ресурс') {
    super(`${what} не найден`, { status: 404, code: 'NOT_FOUND' });
  }
}