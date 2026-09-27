import {
  UniqueConstraintError,
  ForeignKeyConstraintError,
  ValidationError as SequelizeValidationError,
} from 'sequelize';
import { ConflictError } from './ConflictError.js';
import { ValidationError } from './ValidationError.js';

export function mapSequelizeError(err) {
  if (err instanceof UniqueConstraintError) {
    const field = err.errors?.[0]?.path ?? 'field';
    return new ConflictError(`Duplicate value for ${field}`);
  }

  if (err instanceof ForeignKeyConstraintError) {
    return new ConflictError('Referenced entity does not exist or is used');
  }

  if (err instanceof SequelizeValidationError) {
    return new ValidationError({
      issues: err.errors.map((e) => ({
        path: [e.path],
        code: e.type || 'validation',
        message: e.message,
      })),
    });
  }

  return err;
}