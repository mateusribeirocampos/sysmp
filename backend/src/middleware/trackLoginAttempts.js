import loginAttempts from "./loginAttempts.js";
import dotenv from 'dotenv';

dotenv.config();

const RATE_LIMIT_WINDOW = Number(process.env.LOGIN_RATE_LIMIT_WINDOW) || 5 * 60 * 1000; // 5 minutos por padrão
const LOGIN_RATE_LIMIT_MAX = Number(process.env.LOGIN_RATE_LIMIT_MAX) || 5; // 5 tentativas por padrão

const trackLoginAttempts = (req, res, next) => {
  const ip = req.ip;
  const currentTime = Date.now();

  let attempts = loginAttempts.get(ip) || {
    count: 0,
    lastAttempt: currentTime,
    blockedUntil: 0,
  }

  if (attempts.blockedUntil > currentTime) {
    return res.status(429).json({
      message: process.env.BLOCKED_IP_MESSAGE || 'IP bloqueado temporariamente',
      blockedUntil: new Date(attempts.blockedUntil).toISOString(),
    });
  }

  if (currentTime - attempts.lastAttempt > RATE_LIMIT_WINDOW) {
    attempts = {
      count: 0,
      lastAttempt: currentTime,
      blockedUntil: 0,
    }
  }

  attempts.count++;
  attempts.lastAttempt = currentTime;

  if (attempts.count > LOGIN_RATE_LIMIT_MAX) {
    attempts.blockedUntil = currentTime + RATE_LIMIT_WINDOW;
    return res.status(429).json({
      message: process.env.BLOCKED_IP_MESSAGE_LOGIN || 'Muitas tentativas de login, tente novamente mais tarde',
      blockedUntil: new Date(attempts.blockedUntil).toISOString(),
    });
  }

  loginAttempts.set(ip, attempts);
  next();
}

const resetLoginAttempts = (req, res, next) => {
  const ip = req.ip;
  loginAttempts.delete(ip);
  next();
}

setInterval(() => {
  loginAttempts.clear();
}, RATE_LIMIT_WINDOW);

export { trackLoginAttempts, resetLoginAttempts };