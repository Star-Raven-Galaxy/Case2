import bcrypt from 'bcrypt';
import { config } from '../config/index.js';
import { usersRepository } from '../repositories/users.repository.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { ConflictError } from '../errors/ConflictError.js';
import { UnauthorizedError } from '../errors/UnauthorizedError.js';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../lib/tokens.js';

function toPublicUser(user) {
  const json = user.toJSON();
  delete json.passwordHash;
  return json;
}

export const authService = {
  async register({ email, password }) {
    const existing = await usersRepository.findByEmail(email);
    if (existing) throw new ConflictError('Email уже зарегистрирован');

    const passwordHash = await bcrypt.hash(password, config.auth.bcryptRounds);
    const user = await usersRepository.create({
      email,
      passwordHash,
      role: 'viewer',
      technicianId: null,
    });

    return toPublicUser(user);
  },

  async login({ email, password }) {
    const user = await usersRepository.findByEmail(email);
    const genericError = new UnauthorizedError('Неверный email или пароль');

    if (!user) throw genericError;
    if (!user.isActive) throw genericError;

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw genericError;

    await usersRepository.updateLastLogin(user.id);

    const payload = {
      sub: user.id,
      role: user.role,
      technicianId: user.technicianId ?? null,
    };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    return { user: toPublicUser(user), accessToken, refreshToken };
  },

  async refresh(refreshToken) {
    if (!refreshToken) throw new UnauthorizedError('Нет refresh-токена');

    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw new UnauthorizedError('Невалидный refresh-токен');
    }

    const user = await usersRepository.findById(payload.sub);
    if (!user || !user.isActive) throw new UnauthorizedError('Пользователь недоступен');

    const newPayload = {
      sub: user.id,
      role: user.role,
      technicianId: user.technicianId ?? null,
    };
    const accessToken = signAccessToken(newPayload);
    return { user: toPublicUser(user), accessToken };
  },

  async me(userId) {
    const user = await usersRepository.findById(userId);
    if (!user) throw new NotFoundError('Пользователь');
    return toPublicUser(user);
  },
};
