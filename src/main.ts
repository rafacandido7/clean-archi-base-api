import 'dotenv/config'

import { ValidationPipe, Logger } from '@nestjs/common'
import { NestFactory, Reflector } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'

import { AppModule } from './app.module'

import { env } from '@infra/env/env'
import {
  HttpLoggingInterceptor,
  TransformResponseInterceptor,
} from '@infra/http/interceptors'
import { corsConfig } from '@infra/security/cors.config'
import { SanitizationPipe } from '@infra/security/sanitization.pipe'
import { createLogger } from '@infra/monitoring/logger.config'
import { setupSwagger } from '@infra/http/swagger.config'

const { apiPort } = env
const logger = new Logger('Bootstrap')

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: createLogger(),
    bufferLogs: true,
  })

  const reflector = app.get(Reflector)

  // Security: CORS Configuration
  app.enableCors(corsConfig)

  // Security: Disable X-Powered-By header
  app.disable('x-powered-by')

  // Security: Trust proxy (for rate limiting behind reverse proxy)
  app.set('trust proxy', 1)

  // Global Interceptors
  app.useGlobalInterceptors(
    new HttpLoggingInterceptor(),
    new TransformResponseInterceptor(reflector),
  )

  // Global Pipes with Security
  app.useGlobalPipes(
    new ValidationPipe({
      // Security: Remove unknown properties
      whitelist: true,
      // Security: Throw error on unknown properties
      forbidNonWhitelisted: true,
      // Transform payloads to DTO instances
      transform: true,
      // Transform options
      transformOptions: {
        enableImplicitConversion: true,
      },
      // Detailed error messages (disable in production)
      disableErrorMessages: process.env.NODE_ENV === 'production',
      // Validate each item in arrays
      validateCustomDecorators: true,
    }),
    new SanitizationPipe(),
  )

  // API Documentation
  if (process.env.SWAGGER_ENABLED !== 'false') {
    setupSwagger(app)
  }

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    logger.log('SIGTERM received, shutting down gracefully')
    await app.close()
    process.exit(0)
  })

  process.on('SIGINT', async () => {
    logger.log('SIGINT received, shutting down gracefully')
    await app.close()
    process.exit(0)
  })

  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error.stack)
    process.exit(1)
  })

  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason)
    process.exit(1)
  })

  await app.listen(apiPort, () => {
    logger.log(`🚀 Application is running on: http://localhost:${apiPort}`)

    if (process.env.SWAGGER_ENABLED !== 'false') {
      logger.log(`📚 API Documentation: http://localhost:${apiPort}/docs`)
    }

    logger.log(`🏥 Health Check: http://localhost:${apiPort}/monitoring/health`)
    logger.log(`📊 Metrics: http://localhost:${apiPort}/monitoring/metrics`)
    logger.log('🔒 Security features enabled')
    logger.log('📈 Monitoring & observability enabled')
    logger.log(`🛡️ CORS configured for: ${process.env.CORS_ORIGIN || 'localhost'}`)
  })
}

bootstrap().catch((error) => {
  logger.error('Failed to start application', error.stack)
  process.exit(1)
})
