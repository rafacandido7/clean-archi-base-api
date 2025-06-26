import { Module, Global } from '@nestjs/common'
import { TerminusModule } from '@nestjs/terminus'
import { MongooseModule } from '@nestjs/mongoose'
import { APP_INTERCEPTOR } from '@nestjs/core'

import { HealthService } from './health.service'
import { MetricsService } from './metrics.service'
import { MonitoringController } from './monitoring.controller'
import { RequestLoggingInterceptor } from './request-logging.interceptor'
import { MetricsInterceptor } from './metrics.interceptor'

@Global()
@Module({
  imports: [
    TerminusModule,
    MongooseModule, // For health checks
  ],
  controllers: [MonitoringController],
  providers: [
    HealthService,
    MetricsService,
    // Global interceptors
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestLoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: MetricsInterceptor,
    },
  ],
  exports: [
    HealthService,
    MetricsService,
    RequestLoggingInterceptor,
    MetricsInterceptor,
  ],
})
export class MonitoringModule {}
