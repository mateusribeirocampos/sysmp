import jwt from 'jsonwebtoken';
import logger from '../config/logger.js';
import config from '../config/index.js';

// Classe de erros customizados
class AuthError extends Error {
  constructor(message, statusCode = 401) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AuthError';
  }
}

// Funções auxiliares
const extractTokenFromHeader = (authHeader) => {
  if (!authHeader) {
    throw new AuthError('Token não fornecido');
  }

  const [bearer, token] = authHeader.split(' ');
  
  if (bearer !== 'Bearer' || !token) {
    throw new AuthError('Token malformado');
  }

  return token;
};

// Função principal para criar token
const CreateToken = async (id_user) => {
  try {
    const token = jwt.sign(
      { id: id_user },
      config.jwt.secret,
      {
        expiresIn: config.jwt.expiresIn,
        issuer: config.jwt.issuer
      }
    );

    logger.info('Token criado com sucesso', { userId: id_user });
    return token;
  } catch (error) {
    logger.error('Erro ao criar token', { error: error.message, userId: id_user });
    throw new AuthError('Erro ao criar token', 500);
  }
};

// Middleware de validação
const ValidateToken = async (req, res, next) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    const decoded = jwt.verify(token, config.jwt.secret);
    
    // Adiciona informações do usuário ao request
    req.user = {
      id: decoded.id,
      iat: decoded.iat,
      exp: decoded.exp
    };

    logger.info('Token validado com sucesso', { userId: decoded.id });
    next();
  } catch (error) {
    logger.error('Erro na validação do token', { error: error.message });
    
    if (error instanceof AuthError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' });
    }

    return res.status(401).json({ error: 'Token inválido' });
  }
};

export { CreateToken, ValidateToken, AuthError };