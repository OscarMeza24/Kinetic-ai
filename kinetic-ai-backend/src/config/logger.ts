import winston from 'winston';
import { env } from './env.js';

const colors = {
  error: '\x1b[31m',      // Red
  warn: '\x1b[33m',       // Yellow
  info: '\x1b[36m',       // Cyan
  http: '\x1b[35m',       // Magenta
  debug: '\x1b[32m',      // Green
  reset: '\x1b[0m',
};

const customFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ level, message, timestamp, ...meta }) => {
    const levelColor = colors[level as keyof typeof colors] || colors.reset;
    const metaString = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `${levelColor}[${timestamp}] ${level.toUpperCase()}${colors.reset} - ${message}${metaString}`;
  })
);

export const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  format: customFormat,
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880,
      maxFiles: 5,
    }),
  ],
});

// Log unhandled exceptions
logger.exceptions.handle(
  new winston.transports.File({ filename: 'logs/exceptions.log' })
);
