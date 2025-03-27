import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

dotenv.config();

const GeneralLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW) || 15 * 60 * 1000, // 15 minutos por padrão
  max: Number(process.env.GENERAL_RATE_LIMIT_MAX) || 100, // limite de 100 requisições por padrão
  message: {
    error: process.env.RATE_LIMIT_MESSAGE || 'Muitas requisições, tente novamente mais tarde'
  },
  skip: (req) => req.path.startsWith('/login') // Ignora o rate limit para a rota de login
});

export default GeneralLimiter;