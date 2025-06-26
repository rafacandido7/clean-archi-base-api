import { WinstonModule } from 'nest-winston'
import * as winston from 'winston'

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, context, trace, ...metadata }) => {
    const logEntry: any = {
      timestamp,
      level: level.toUpperCase(),
      context: context || 'Application',
      message,
    }

    if (trace) {
      logEntry.trace = trace
    }

    if (Object.keys(metadata).length > 0) {
      logEntry.metadata = metadata
    }

    return JSON.stringify(logEntry)
  }),
)

const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(({ timestamp, level, message, context }) => {
    const ctx = context ? `[${context}]` : ''
    return `${timestamp} ${level} ${ctx} ${message}`
  }),
)

export const createLogger = () => {
  const transports: winston.transport[] = []

  // Console transport for development
  if (process.env.NODE_ENV !== 'production') {
    transports.push(
      new winston.transports.Console({
        format: consoleFormat,
        level: process.env.LOG_LEVEL || 'debug',
      }),
    )
  }

  // File transports for production
  if (process.env.NODE_ENV === 'production') {
    // Combined logs
    transports.push(
      new winston.transports.File({
        filename: 'logs/combined.log',
        format: logFormat,
        level: 'info',
        maxsize: 10 * 1024 * 1024, // 10MB
        maxFiles: 5,
      }),
    )

    // Error logs
    transports.push(
      new winston.transports.File({
        filename: 'logs/error.log',
        format: logFormat,
        level: 'error',
        maxsize: 10 * 1024 * 1024, // 10MB
        maxFiles: 5,
      }),
    )

    // Security logs
    transports.push(
      new winston.transports.File({
        filename: 'logs/security.log',
        format: logFormat,
        level: 'warn',
        maxsize: 10 * 1024 * 1024, // 10MB
        maxFiles: 10,
      }),
    )

    // Console for production (structured)
    transports.push(
      new winston.transports.Console({
        format: logFormat,
        level: process.env.LOG_LEVEL || 'info',
      }),
    )
  }

  return WinstonModule.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: logFormat,
    transports,
    exceptionHandlers: [
      new winston.transports.File({
        filename: 'logs/exceptions.log',
        format: logFormat,
      }),
    ],
    rejectionHandlers: [
      new winston.transports.File({
        filename: 'logs/rejections.log',
        format: logFormat,
      }),
    ],
  })
}
