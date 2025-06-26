import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap, catchError } from 'rxjs/operators'
import { Request, Response } from 'express'
import { MetricsService } from './metrics.service'

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(private readonly metricsService: MetricsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>()
    const response = context.switchToHttp().getResponse<Response>()

    const startTime = Date.now()
    const method = request.method
    const route = this.getRoute(context)

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime
        const statusCode = response.statusCode

        // Record HTTP metrics
        this.metricsService.recordHttpRequest(method, route, statusCode, duration)

        // Record business metrics based on route
        this.recordBusinessMetrics(method, route, statusCode)
      }),
      catchError((error) => {
        const duration = Date.now() - startTime
        const statusCode = response.statusCode || 500

        // Record HTTP metrics for errors
        this.metricsService.recordHttpRequest(method, route, statusCode, duration)

        // Record error metrics
        this.metricsService.recordError(
          error.constructor.name,
          this.getErrorSeverity(statusCode),
        )

        throw error
      }),
    )
  }

  private getRoute(context: ExecutionContext): string {
    const handler = context.getHandler()
    const controller = context.getClass()

    // Try to get route from metadata
    const controllerName = controller.name.replace('Controller', '').toLowerCase()
    const handlerName = handler.name

    return `/${controllerName}/${handlerName}`
  }

  private recordBusinessMetrics(method: string, route: string, statusCode: number) {
    // User registration
    if (method === 'POST' && route.includes('user') && statusCode === 201) {
      this.metricsService.incrementUserRegistrations()
    }

    // User login
    if (method === 'POST' && route.includes('auth/login')) {
      this.metricsService.recordUserLogin(statusCode === 200)
    }

    // Security events
    if (statusCode === 401 || statusCode === 403) {
      this.metricsService.recordSecurityEvent('unauthorized_access', 'medium')
    }

    if (statusCode === 429) {
      this.metricsService.recordSecurityEvent('rate_limit_exceeded', 'low')
    }
  }

  private getErrorSeverity(statusCode: number): 'low' | 'medium' | 'high' | 'critical' {
    if (statusCode >= 500) return 'critical'
    if (statusCode >= 400) return 'medium'
    return 'low'
  }
}
