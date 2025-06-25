import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name)

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const request = ctx.getRequest()

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error'

    const errorResponse = {
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      statusCode: status,
      error: message,
    }

    this.logger.error(JSON.stringify(exception, null, 2))

    response.status(status).json(errorResponse)
  }
}
