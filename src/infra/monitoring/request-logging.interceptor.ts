import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap, catchError } from 'rxjs/operators'
import { Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'

interface RequestLog {
  requestId: string
  method: string
  url: string
  userAgent: string
  ip: string
  userId?: string
  timestamp: string
  duration?: number
  statusCode?: number
  responseSize?: number
  error?: string
}

@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RequestLoggingInterceptor.name)

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>()
    const response = context.switchToHttp().getResponse<Response>()

    // Generate unique request ID
    const requestId = uuidv4()
    request.headers['x-request-id'] = requestId
    response.setHeader('X-Request-ID', requestId)

    const startTime = Date.now()

    const requestLog: RequestLog = {
      requestId,
      method: request.method,
      url: request.url,
      userAgent: request.headers['user-agent'] || 'unknown',
      ip: this.getClientIp(request),
      userId: (request as any).user?.id,
      timestamp: new Date().toISOString(),
    }

    // Log incoming request
    this.logger.log('Incoming request', {
      ...requestLog,
      body: this.sanitizeBody(request.body),
      query: request.query,
      params: request.params,
    })

    return next.handle().pipe(
      tap((data) => {
        const duration = Date.now() - startTime
        const responseSize = JSON.stringify(data || {}).length

        this.logger.log('Request completed', {
          ...requestLog,
          duration,
          statusCode: response.statusCode,
          responseSize,
        })

        // Log slow requests
        if (duration > 1000) {
          this.logger.warn('Slow request detected', {
            ...requestLog,
            duration,
            threshold: 1000,
          })
        }
      }),
      catchError((error) => {
        const duration = Date.now() - startTime

        this.logger.error('Request failed', {
          ...requestLog,
          duration,
          statusCode: response.statusCode,
          error: error.message,
          stack: error.stack,
        })

        throw error
      }),
    )
  }

  private getClientIp(request: Request): string {
    const forwarded = request.headers['x-forwarded-for'] as string
    const realIp = request.headers['x-real-ip'] as string

    if (forwarded) {
      return forwarded.split(',')[0].trim()
    }

    return realIp || request.connection?.remoteAddress || 'unknown'
  }

  private sanitizeBody(body: any): any {
    if (!body || typeof body !== 'object') {
      return body
    }

    const sanitized = { ...body }

    // Remove sensitive fields
    const sensitiveFields = ['password', 'token', 'secret', 'key', 'authorization']

    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]'
      }
    }

    return sanitized
  }
}
