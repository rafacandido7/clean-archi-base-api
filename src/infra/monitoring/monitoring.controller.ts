import { Controller, Get, Header, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { HealthService } from './health.service'
import { MetricsService } from './metrics.service'

@ApiTags('Monitoring')
@Controller('monitoring')
export class MonitoringController {
  constructor(
    private readonly healthService: HealthService,
    private readonly metricsService: MetricsService,
  ) {}

  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  @ApiResponse({ status: 503, description: 'Service is unhealthy' })
  async getHealth() {
    const health = await this.healthService.check()
    return health
  }

  @Get('health/detailed')
  @ApiOperation({ summary: 'Detailed health check with system information' })
  @ApiResponse({ status: 200, description: 'Detailed health information' })
  async getDetailedHealth() {
    const health = await this.healthService.getDetailedHealth()
    return health
  }

  @Get('metrics')
  @Header('Content-Type', 'text/plain')
  @ApiOperation({ summary: 'Prometheus metrics endpoint' })
  @ApiResponse({
    status: 200,
    description: 'Prometheus metrics in text format',
    content: {
      'text/plain': {
        schema: {
          type: 'string',
          example: '# HELP http_requests_total Total number of HTTP requests\n# TYPE http_requests_total counter\nhttp_requests_total{method="GET",route="/health",status_code="200"} 1',
        },
      },
    },
  })
  async getMetrics(): Promise<string> {
    return this.metricsService.getMetrics()
  }

  @Get('info')
  @ApiOperation({ summary: 'Application information' })
  @ApiResponse({ status: 200, description: 'Application information' })
  getInfo() {
    return {
      name: 'Clean Architecture API',
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      nodeVersion: process.version,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      features: {
        authentication: true,
        rateLimit: true,
        cors: true,
        helmet: true,
        validation: true,
        sanitization: true,
        monitoring: true,
        healthCheck: true,
        metrics: true,
        structuredLogging: true,
      },
    }
  }

  @Get('status')
  @ApiOperation({ summary: 'Simple status check' })
  @ApiResponse({ status: 200, description: 'Service status' })
  getStatus() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    }
  }
}
