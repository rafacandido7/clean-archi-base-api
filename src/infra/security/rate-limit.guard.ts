import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus, Logger, SetMetadata } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request } from 'express'

interface RateLimitOptions {
  windowMs: number
  maxRequests: number
  skipSuccessfulRequests?: boolean
  skipFailedRequests?: boolean
}

const DEFAULT_OPTIONS: RateLimitOptions = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100,
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
}

// In-memory store (in production, use Redis)
const requestStore = new Map<string, number[]>()

@Injectable()
export class RateLimitGuard implements CanActivate {
  private readonly logger = new Logger(RateLimitGuard.name)

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>()
    const response = context.switchToHttp().getResponse()

    // Get rate limit options from decorator or use defaults
    const options = this.reflector.get<RateLimitOptions>('rateLimit', context.getHandler()) || DEFAULT_OPTIONS

    const clientId = this.getClientId(request)
    const now = Date.now()

    // Get or create request history for this client
    if (!requestStore.has(clientId)) {
      requestStore.set(clientId, [])
    }

    const requests = requestStore.get(clientId)!

    // Remove expired requests
    const validRequests = requests.filter(timestamp => now - timestamp < options.windowMs)

    // Check if limit exceeded
    if (validRequests.length >= options.maxRequests) {
      this.logger.warn(`Rate limit exceeded for client: ${clientId}`)

      // Set rate limit headers
      response.setHeader('X-RateLimit-Limit', options.maxRequests)
      response.setHeader('X-RateLimit-Remaining', 0)
      response.setHeader('X-RateLimit-Reset', new Date(now + options.windowMs).toISOString())

      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: 'Too many requests, please try again later',
          error: 'Rate Limit Exceeded',
        },
        HttpStatus.TOO_MANY_REQUESTS,
      )
    }

    // Add current request
    validRequests.push(now)
    requestStore.set(clientId, validRequests)

    // Set rate limit headers
    response.setHeader('X-RateLimit-Limit', options.maxRequests)
    response.setHeader('X-RateLimit-Remaining', options.maxRequests - validRequests.length)
    response.setHeader('X-RateLimit-Reset', new Date(now + options.windowMs).toISOString())

    return true
  }

  private getClientId(request: Request): string {
    // Priority: X-Forwarded-For > X-Real-IP > connection.remoteAddress
    const forwarded = request.headers['x-forwarded-for'] as string
    const realIp = request.headers['x-real-ip'] as string
    const connectionIp = request.connection?.remoteAddress

    if (forwarded) {
      return forwarded.split(',')[0].trim()
    }

    return realIp || connectionIp || 'unknown'
  }
}

// Decorator for custom rate limiting
export const RateLimit = (options: Partial<RateLimitOptions>) => {
  return SetMetadata('rateLimit', { ...DEFAULT_OPTIONS, ...options })
}
