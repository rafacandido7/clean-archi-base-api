import { Injectable, PipeTransform, ArgumentMetadata, Logger } from '@nestjs/common'

@Injectable()
export class SanitizationPipe implements PipeTransform {
  private readonly logger = new Logger(SanitizationPipe.name)

  transform(value: any, metadata: ArgumentMetadata) {
    if (value === null || value === undefined) {
      return value
    }

    // Only sanitize body and query parameters
    if (metadata.type === 'body' || metadata.type === 'query') {
      return this.sanitizeValue(value)
    }

    return value
  }

  private sanitizeValue(value: any): any {
    if (typeof value === 'string') {
      return this.sanitizeString(value)
    }

    if (Array.isArray(value)) {
      return value.map(item => this.sanitizeValue(item))
    }

    if (typeof value === 'object' && value !== null) {
      const sanitized: any = {}
      for (const [key, val] of Object.entries(value)) {
        sanitized[this.sanitizeString(key)] = this.sanitizeValue(val)
      }
      return sanitized
    }

    return value
  }

  private sanitizeString(str: string): string {
    if (typeof str !== 'string') {
      return str
    }

    let sanitized = str

    // Remove null bytes
    sanitized = sanitized.replace(/\0/g, '')

    // Remove HTML tags (basic XSS prevention)
    sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    sanitized = sanitized.replace(/<[^>]*>/g, '')

    // Remove SQL injection patterns
    sanitized = sanitized.replace(/('|(\\')|(;)|(\\)|(\/\*)|(--)|(\*\/))/gi, '')

    // Remove NoSQL injection patterns
    sanitized = sanitized.replace(/(\$where|\$ne|\$in|\$nin|\$not|\$or|\$and|\$nor|\$exists|\$type|\$mod|\$regex|\$text|\$search)/gi, '')

    // Trim whitespace
    sanitized = sanitized.trim()

    // Log if significant sanitization occurred
    if (sanitized !== str && sanitized.length < str.length * 0.8) {
      this.logger.warn(`Significant sanitization applied: "${str}" -> "${sanitized}"`)
    }

    return sanitized
  }
}
