import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common'
import { Request, Response } from 'express'

@Catch()
export class SecurityExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(SecurityExceptionFilter.name)

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    let status = HttpStatus.INTERNAL_SERVER_ERROR
    let message = 'Internal server error'
    let error = 'Internal Server Error'

    // Handle HTTP exceptions
    if (exception instanceof HttpException) {
      status = exception.getStatus()
      const exceptionResponse = exception.getResponse()

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        message = (exceptionResponse as any).message || exception.message
        error = (exceptionResponse as any).error || exception.name
      } else {
        message = exceptionResponse as string
        error = exception.name
      }
    }

    // Log security-related errors
    this.logSecurityEvent(request, status, message, exception)

    // Prepare response
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: this.sanitizeErrorMessage(message, status),
      error: this.sanitizeErrorType(error, status),
      ...(process.env.NODE_ENV === 'development' && {
        stack: exception instanceof Error ? exception.stack : undefined,
      }),
    }

    // Set security headers for error responses
    response.setHeader('X-Content-Type-Options', 'nosniff')
    response.setHeader('X-Frame-Options', 'DENY')

    response.status(status).json(errorResponse)
  }

  private logSecurityEvent(request: Request, status: number, message: string, exception: unknown) {
    const clientIp = this.getClientIp(request)
    const userAgent = request.headers['user-agent'] || 'unknown'

    const logData = {
      ip: clientIp,
      method: request.method,
      url: request.url,
      userAgent,
      status,
      message,
    }

    // Log different levels based on status code
    if (status >= 500) {
      this.logger.error(`Server error: ${JSON.stringify(logData)}`, exception instanceof Error ? exception.stack : undefined)
    } else if (status === 429) {
      this.logger.warn(`Rate limit exceeded: ${JSON.stringify(logData)}`)
    } else if (status === 401 || status === 403) {
      this.logger.warn(`Authentication/Authorization failure: ${JSON.stringify(logData)}`)
    } else if (status >= 400) {
      this.logger.warn(`Client error: ${JSON.stringify(logData)}`)
    }
  }

  private getClientIp(request: Request): string {
    const forwarded = request.headers['x-forwarded-for'] as string
    const realIp = request.headers['x-real-ip'] as string

    if (forwarded) {
      return forwarded.split(',')[0].trim()
    }

    return realIp || request.connection?.remoteAddress || 'unknown'
  }

  private sanitizeErrorMessage(message: string, status: number): string {
    // Don't expose internal details in production
    if (process.env.NODE_ENV === 'production' && status >= 500) {
      return 'Internal server error'
    }

    // Sanitize sensitive information from error messages
    return message
      .replace(/password/gi, '[REDACTED]')
      .replace(/token/gi, '[REDACTED]')
      .replace(/secret/gi, '[REDACTED]')
      .replace(/key/gi, '[REDACTED]')
  }

  private sanitizeErrorType(error: string, status: number): string {
    // Generic error types for production
    if (process.env.NODE_ENV === 'production') {
      if (status >= 500) return 'Internal Server Error'
      if (status === 404) return 'Not Found'
      if (status === 401) return 'Unauthorized'
      if (status === 403) return 'Forbidden'
      if (status === 429) return 'Too Many Requests'
      if (status >= 400) return 'Bad Request'
    }

    return error
  }
}
