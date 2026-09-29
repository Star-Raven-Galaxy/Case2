import { verifyAccessToken } from '../lib/tokens.js';
import { UnauthorizedError } from '../errors/UnauthorizedError.js';

export function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Отсутствует access-токен'));
  }

  const token = header.slice('Bearer '.length).trim();
  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    next(new UnauthorizedError('Невалидный или просроченный access-токен'));
  }
}