import { AppError } from './AppError.js';

export class ValidationError extends AppError {
  constructor(zodError) {
    super('Некорректные данные запроса', {
      status: 422,
      code: 'VALIDATION_ERROR',
      details: zodError.issues.map((i) => ({
        field: i.path.join('.') || '(корень)',
        code: i.code,
        message: i.message,
      })),
    });
  }
}