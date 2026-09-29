import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';

export function signAccessToken(payload) {
  return jwt.sign(payload, config.auth.accessSecret, {
    expiresIn: config.auth.accessTtl,
  });
}

export function signRefreshToken(payload) {
  return jwt.sign(payload, config.auth.refreshSecret, {
    expiresIn: config.auth.refreshTtl,
  });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, config.auth.accessSecret);
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, config.auth.refreshSecret);
}