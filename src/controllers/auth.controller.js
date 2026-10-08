import { authService } from '../services/auth.service.js';
import { config } from '../config/index.js';

const REFRESH_COOKIE = 'refresh_token';

function setRefreshCookie(res, token) {
  res.cookie(REFRESH_COOKIE, token, {
    httpOnly: true,
    secure: config.auth.cookieSecure,
    sameSite: config.auth.cookieSameSite,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/api/auth',
  });
}

function clearRefreshCookie(res) {
  res.clearCookie(REFRESH_COOKIE, {
    httpOnly: true,
    secure: config.auth.cookieSecure,
    sameSite: config.auth.cookieSameSite,
    path: '/api/auth',
  });
}

export const authController = {
  async register(req, res) {
    const user = await authService.register(req.valid.body);
    res.status(201).json({ data: user });
  },

  async login(req, res) {
    const { user, accessToken, refreshToken } = await authService.login(req.valid.body);
    setRefreshCookie(res, refreshToken);
    res.json({ data: { user, accessToken } });
  },

  async refresh(req, res) {
    const token = req.cookies?.[REFRESH_COOKIE];
    const { user, accessToken } = await authService.refresh(token);
    res.json({ data: { user, accessToken } });
  },

  async logout(req, res) {
    clearRefreshCookie(res);
    res.status(204).send();
  },

  async me(req, res) {
    const user = await authService.me(req.user.id);
    res.json({ data: user });
  },
};
