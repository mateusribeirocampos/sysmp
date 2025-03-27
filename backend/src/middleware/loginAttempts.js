import RateLimiter from 'express-rate-limit';
import dotenv from 'dotenv';

dotenv.config();

const loginAttempts = new Map();

const RATE_LIMIT_WINDOW = Number(process.env.LOGIN_RATE_LIMIT_WINDOW) || 5 * 60 * 1000; // 5 minutos por padrão
const LOGIN_RATE_LIMIT_MAX = Number(process.env.LOGIN_RATE_LIMIT_MAX) || 5; // 5 tentativas por padrão
const RATE_LIMIT_MESSAGE = process.env.RATE_LIMIT_MESSAGE || 'Muitas tentativas de login, tente novamente mais tarde';

const loginLimiter = RateLimiter({
  windowMs: RATE_LIMIT_WINDOW,
  max: LOGIN_RATE_LIMIT_MAX,
  handler: (req, res) => {
    res.status(429).json({
      message: RATE_LIMIT_MESSAGE,
      blockedUntil: new Date(Date.now() + RATE_LIMIT_WINDOW).toISOString(),
    });
  },
  keyGenerator: (req) => req.ip
});

export { loginLimiter };
export default loginAttempts;