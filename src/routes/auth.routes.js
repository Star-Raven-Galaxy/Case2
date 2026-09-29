import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { config } from '../config/index.js';
import { validate } from '../middlewares/validate.js';
import { authenticate } from '../middlewares/authenticate.js';
import { authController } from '../controllers/auth.controller.js';
import { registerSchema, loginSchema, logoutSchema } from '../validators/auth.schema.js';

export const authRouter = Router();

const loginLimiter = rateLimit({
  windowMs: config.auth.loginRateLimit.windowMs,
  max: config.auth.loginRateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { code: 'RATE_LIMIT', message: 'Слишком много попыток входа' } },
});

authRouter.post('/register', validate(registerSchema), authController.register);
authRouter.post('/login', loginLimiter, validate(loginSchema), authController.login);
authRouter.post('/refresh', authController.refresh);
authRouter.post('/logout', validate(logoutSchema), authController.logout);
authRouter.get('/me', authenticate, authController.me);
