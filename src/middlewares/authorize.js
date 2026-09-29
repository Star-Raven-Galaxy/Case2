import { ForbiddenError } from '../errors/ForbiddenError.js';

export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) return next(new ForbiddenError());
    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenError(`Требуется роль: ${roles.join(', ')}`));
    }
    next();
  };
}