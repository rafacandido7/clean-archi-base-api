import { Injectable, Logger } from '@nestjs/common'
import { register, Counter, Histogram, Gauge, collectDefaultMetrics } from 'prom-client'

@Injectable()
export class MetricsService {
  private readonly logger = new Logger(MetricsService.name)

  // HTTP Metrics
  public readonly httpRequestsTotal = new Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code'],
  })

  public readonly httpRequestDuration = new Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
  })

  // Business Metrics
  public readonly usersTotal = new Gauge({
    name: 'users_total',
    help: 'Total number of users',
  })

  public readonly userRegistrations = new Counter({
    name: 'user_registrations_total',
    help: 'Total number of user registrations',
  })

  public readonly userLogins = new Counter({
    name: 'user_logins_total',
    help: 'Total number of user logins',
    labelNames: ['status'],
  })

  // Security Metrics
  public readonly securityEvents = new Counter({
    name: 'security_events_total',
    help: 'Total number of security events',
    labelNames: ['type', 'severity'],
  })

  public readonly rateLimitHits = new Counter({
    name: 'rate_limit_hits_total',
    help: 'Total number of rate limit hits',
    labelNames: ['ip', 'endpoint'],
  })

  // Database Metrics
  public readonly databaseConnections = new Gauge({
    name: 'database_connections_active',
    help: 'Number of active database connections',
  })

  public readonly databaseQueryDuration = new Histogram({
    name: 'database_query_duration_seconds',
    help: 'Duration of database queries in seconds',
    labelNames: ['operation', 'collection'],
    buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 3, 5],
  })

  // Error Metrics
  public readonly errorsTotal = new Counter({
    name: 'errors_total',
    help: 'Total number of errors',
    labelNames: ['type', 'severity'],
  })

  constructor() {
    // Collect default metrics (CPU, memory, etc.)
    collectDefaultMetrics({ register })

    this.logger.log('Metrics service initialized')
  }

  // HTTP Metrics Methods
  recordHttpRequest(method: string, route: string, statusCode: number, duration: number) {
    this.httpRequestsTotal.inc({ method, route, status_code: statusCode })
    this.httpRequestDuration.observe({ method, route, status_code: statusCode }, duration / 1000)
  }

  // Business Metrics Methods
  setUsersTotal(count: number) {
    this.usersTotal.set(count)
  }

  incrementUserRegistrations() {
    this.userRegistrations.inc()
  }

  recordUserLogin(success: boolean) {
    this.userLogins.inc({ status: success ? 'success' : 'failure' })
  }

  // Security Metrics Methods
  recordSecurityEvent(type: string, severity: 'low' | 'medium' | 'high' | 'critical') {
    this.securityEvents.inc({ type, severity })
  }

  recordRateLimitHit(ip: string, endpoint: string) {
    this.rateLimitHits.inc({ ip, endpoint })
  }

  // Database Metrics Methods
  setDatabaseConnections(count: number) {
    this.databaseConnections.set(count)
  }

  recordDatabaseQuery(operation: string, collection: string, duration: number) {
    this.databaseQueryDuration.observe({ operation, collection }, duration / 1000)
  }

  // Error Metrics Methods
  recordError(type: string, severity: 'low' | 'medium' | 'high' | 'critical') {
    this.errorsTotal.inc({ type, severity })
  }

  // Get all metrics
  async getMetrics(): Promise<string> {
    return register.metrics()
  }

  // Reset metrics (useful for testing)
  resetMetrics() {
    register.clear()
  }
}
