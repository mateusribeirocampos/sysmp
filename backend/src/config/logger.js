import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
import { promises as fs } from 'fs';

const isDevelopment = process.env.NODE_ENV === 'development';

// Formatação para desenvolvimento
const devFormat = format.printf(({ timestamp, level, message, metadata }) => {
  return `[${timestamp}] ${level}: ${message} ${Object.keys(metadata).length ? JSON.stringify(metadata) : ''}`;
});

// Configuração principal
const logger = createLogger({
  level: isDevelopment ? 'debug' : 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.metadata({ fillExcept: ['message', 'level', 'timestamp'] }),
    isDevelopment ? devFormat : format.json()
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        devFormat
      )
    }),
    new DailyRotateFile({
      filename: path.join('logs', 'combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxFiles: '30d',
      zippedArchive: true
    }),
    new transports.File({ 
      filename: path.join('logs', 'error.log'), 
      level: 'error'
    })
  ],
  exceptionHandlers: [
    new transports.File({ filename: 'logs/exceptions.log' })
  ]
});

// Criação assíncrona do diretório
(async () => {
  try {
    await fs.access('logs');
  } catch {
    await fs.mkdir('logs');
  }
})();

export default logger;