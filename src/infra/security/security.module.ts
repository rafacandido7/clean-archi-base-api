import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common'
import { APP_GUARD, APP_FILTER, APP_PIPE } from '@nestjs/core'
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler'
import { SecurityMiddleware } from './security.middleware'
import { RateLimitGuard } from './rate-limit.guard'
import { SanitizationPipe } from './sanitization.pipe'
import { SecurityExceptionFilter } from './security-exception.filter'

@Module({
  imports: [
    // Throttler module for advanced rate limiting
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000, // 1 second
        limit: 10, // 10 requests per second
      },
      {
        name: 'medium',
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
      {
        name: 'long',
        ttl: 900000, // 15 minutes
        limit: 1000, // 1000 requests per 15 minutes
      },
    ]),
  ],
  providers: [
    // Global rate limiting guard
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    // Custom rate limiting guard
    {
      provide: APP_GUARD,
      useClass: RateLimitGuard,
    },
    // Global sanitization pipe
    {
      provide: APP_PIPE,
      useClass: SanitizationPipe,
    },
    // Global security exception filter
    {
      provide: APP_FILTER,
      useClass: SecurityExceptionFilter,
    },
  ],
  exports: [
    SecurityMiddleware,
    RateLimitGuard,
    SanitizationPipe,
    SecurityExceptionFilter,
  ],
})
export class SecurityModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply security middleware to all routes
    consumer.apply(SecurityMiddleware).forRoutes('*')
  }
}
