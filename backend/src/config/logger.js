import { createLogger, format, transports } from 'winston';
import path from 'path';

// Configuração do logger
const logger = createLogger({
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      )
    }),
    new transports.File({ 
      filename: path.join('logs', 'error.log'), 
      level: 'error' 
    }),
    new transports.File({ 
      filename: path.join('logs', 'combined.log')
    })
  ]
});

// Criar diretório de logs se não existir
import fs from 'fs';
if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs');
}

export default logger; 