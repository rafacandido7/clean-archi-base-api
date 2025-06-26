import { Injectable, Logger } from '@nestjs/common'
import { HealthCheckService, HealthCheck, MongooseHealthIndicator } from '@nestjs/terminus'
import { MetricsService } from './metrics.service'

export interface HealthStatus {
  status: 'ok' | 'error'
  timestamp: string
  uptime: number
  version: string
  environment: string
  checks: {
    database: any
    memory: any
    disk: any
  }
  metrics?: {
    totalRequests: number
    totalUsers: number
    errorRate: number
  }
}

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name)
  private readonly startTime = Date.now()

  constructor(
    private health: HealthCheckService,
    private mongoose: MongooseHealthIndicator,
    private metricsService: MetricsService,
  ) {}

  @HealthCheck()
  async check(): Promise<HealthStatus> {
    try {
      const healthResult = await this.health.check([
        // Database health
        () => this.mongoose.pingCheck('database'),
      ])

      // Manual checks for memory and disk
      const memoryCheck = this.checkMemoryHealth()
      const diskCheck = this.checkDiskHealth()

      const status: HealthStatus = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: Date.now() - this.startTime,
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        checks: {
          database: healthResult.details.database,
          memory: memoryCheck,
          disk: diskCheck,
        },
      }

      // Add metrics in production
      if (process.env.NODE_ENV === 'production') {
        status.metrics = await this.getHealthMetrics()
      }

      this.logger.debug('Health check completed successfully')
      return status
    } catch (error) {
      this.logger.error('Health check failed', error.stack)

      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        uptime: Date.now() - this.startTime,
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        checks: {
          database: { status: 'error', message: error.message },
          memory: { status: 'error' },
          disk: { status: 'error' },
        },
      }
    }
  }

  private checkMemoryHealth() {
    const memoryUsage = process.memoryUsage()
    const totalMemory = memoryUsage.heapTotal
    const usedMemory = memoryUsage.heapUsed
    const memoryUsagePercent = (usedMemory / totalMemory) * 100

    const isHealthy = memoryUsagePercent < 90 // Alert if memory usage > 90%

    return {
      status: isHealthy ? 'ok' : 'error',
      message: `Memory usage: ${memoryUsagePercent.toFixed(2)}%`,
      heapUsed: `${Math.round(usedMemory / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(totalMemory / 1024 / 1024)}MB`,
      external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`,
      rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
    }
  }

  private checkDiskHealth() {
    try {
      const fs = require('fs')
      const stats = fs.statSync('.')

      // Simple disk check - in production, use more sophisticated monitoring
      return {
        status: 'ok',
        message: 'Disk accessible',
        accessible: true,
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'Disk not accessible',
        error: error.message,
      }
    }
  }

  private async getHealthMetrics() {
    try {
      // Get metrics from Prometheus registry
      const metrics = await this.metricsService.getMetrics()

      // Parse basic metrics (simplified)
      const totalRequests = this.extractMetricValue(metrics, 'http_requests_total')
      const totalUsers = this.extractMetricValue(metrics, 'users_total')
      const totalErrors = this.extractMetricValue(metrics, 'errors_total')

      const errorRate = totalRequests > 0 ? (totalErrors / totalRequests) * 100 : 0

      return {
        totalRequests,
        totalUsers,
        errorRate: Math.round(errorRate * 100) / 100,
      }
    } catch (error) {
      this.logger.warn('Failed to get health metrics', error.message)
      return undefined
    }
  }

  private extractMetricValue(metrics: string, metricName: string): number {
    try {
      const lines = metrics.split('\n')
      const metricLine = lines.find(line =>
        line.startsWith(metricName) && !line.startsWith('#'),
      )

      if (metricLine) {
        const value = metricLine.split(' ')[1]
        return parseFloat(value) || 0
      }

      return 0
    } catch {
      return 0
    }
  }

  // Detailed health check for monitoring systems
  async getDetailedHealth() {
    const basicHealth = await this.check()

    return {
      ...basicHealth,
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        pid: process.pid,
        uptime: process.uptime(),
      },
      performance: {
        eventLoopDelay: await this.measureEventLoopDelay(),
        gcStats: this.getGCStats(),
      },
    }
  }

  private async measureEventLoopDelay(): Promise<number> {
    return new Promise((resolve) => {
      const start = process.hrtime.bigint()
      setImmediate(() => {
        const delta = process.hrtime.bigint() - start
        resolve(Number(delta) / 1000000) // Convert to milliseconds
      })
    })
  }

  private getGCStats() {
    try {
      const v8 = require('v8')
      const heapStats = v8.getHeapStatistics()

      return {
        totalHeapSize: Math.round(heapStats.total_heap_size / 1024 / 1024),
        usedHeapSize: Math.round(heapStats.used_heap_size / 1024 / 1024),
        heapSizeLimit: Math.round(heapStats.heap_size_limit / 1024 / 1024),
      }
    } catch {
      return null
    }
  }
}
