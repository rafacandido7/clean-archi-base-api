import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import helmet from 'helmet'

@Injectable()
export class SecurityMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Apply Helmet security headers
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https:'],
          fontSrc: ["'self'"],
          connectSrc: ["'self'"],
          frameAncestors: ["'none'"],
        },
      },
      crossOriginEmbedderPolicy: false, // Disable for API compatibility
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
    })(req, res, () => {
      // Additional custom headers
      res.setHeader('X-API-Version', '1.0.0')
      res.setHeader('X-Request-ID', req.headers['x-request-id'] || 'unknown')

      // Remove server information
      res.removeHeader('X-Powered-By')
      res.removeHeader('Server')

      next()
    })
  }
}
