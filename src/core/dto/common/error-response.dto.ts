import { ApiProperty } from '@nestjs/swagger'

export class ErrorResponseDto {
  @ApiProperty({
    example: 400,
    description: 'Código de status HTTP',
  })
  statusCode: number

  @ApiProperty({
    example: 'Dados inválidos fornecidos',
    description: 'Mensagem de erro',
  })
  message: string | string[]

  @ApiProperty({
    example: 'Bad Request',
    description: 'Tipo do erro',
  })
  error: string

  @ApiProperty({
    example: '2023-12-01T10:30:00.000Z',
    description: 'Timestamp do erro',
  })
  timestamp: string

  @ApiProperty({
    example: '/api/users',
    description: 'Caminho da requisição que gerou o erro',
  })
  path: string

  @ApiProperty({
    example: 'POST',
    description: 'Método HTTP da requisição',
  })
  method: string
}

export class ValidationErrorResponseDto {
  @ApiProperty({
    example: 400,
    description: 'Código de status HTTP',
  })
  statusCode: 400

  @ApiProperty({
    example: [
      'Nome deve ter entre 2 e 100 caracteres',
      'E-mail deve ter um formato válido',
      'Senha deve conter pelo menos: 1 letra minúscula, 1 maiúscula, 1 número e 1 símbolo',
    ],
    description: 'Lista de erros de validação',
    type: [String],
  })
  message: string[]

  @ApiProperty({
    example: 'Bad Request',
    description: 'Tipo do erro',
  })
  error: string

  @ApiProperty({
    example: '2023-12-01T10:30:00.000Z',
    description: 'Timestamp do erro',
  })
  timestamp: string

  @ApiProperty({
    example: '/api/users',
    description: 'Caminho da requisição que gerou o erro',
  })
  path: string

  @ApiProperty({
    example: 'POST',
    description: 'Método HTTP da requisição',
  })
  method: string
}

export class UnauthorizedErrorResponseDto {
  @ApiProperty({
    example: 401,
    description: 'Código de status HTTP',
  })
  statusCode: 401

  @ApiProperty({
    example: 'Token inválido ou expirado',
    description: 'Mensagem de erro de autenticação',
  })
  message: string

  @ApiProperty({
    example: 'Unauthorized',
    description: 'Tipo do erro',
  })
  error: string

  @ApiProperty({
    example: '2023-12-01T10:30:00.000Z',
    description: 'Timestamp do erro',
  })
  timestamp: string

  @ApiProperty({
    example: '/api/users',
    description: 'Caminho da requisição que gerou o erro',
  })
  path: string

  @ApiProperty({
    example: 'GET',
    description: 'Método HTTP da requisição',
  })
  method: string
}

export class ForbiddenErrorResponseDto {
  @ApiProperty({
    example: 403,
    description: 'Código de status HTTP',
  })
  statusCode: 403

  @ApiProperty({
    example: 'Acesso negado para este recurso',
    description: 'Mensagem de erro de autorização',
  })
  message: string

  @ApiProperty({
    example: 'Forbidden',
    description: 'Tipo do erro',
  })
  error: string

  @ApiProperty({
    example: '2023-12-01T10:30:00.000Z',
    description: 'Timestamp do erro',
  })
  timestamp: string

  @ApiProperty({
    example: '/api/users',
    description: 'Caminho da requisição que gerou o erro',
  })
  path: string

  @ApiProperty({
    example: 'GET',
    description: 'Método HTTP da requisição',
  })
  method: string
}

export class NotFoundErrorResponseDto {
  @ApiProperty({
    example: 404,
    description: 'Código de status HTTP',
  })
  statusCode: 404

  @ApiProperty({
    example: 'Usuário não encontrado',
    description: 'Mensagem de erro de recurso não encontrado',
  })
  message: string

  @ApiProperty({
    example: 'Not Found',
    description: 'Tipo do erro',
  })
  error: string

  @ApiProperty({
    example: '2023-12-01T10:30:00.000Z',
    description: 'Timestamp do erro',
  })
  timestamp: string

  @ApiProperty({
    example: '/api/users/507f1f77bcf86cd799439011',
    description: 'Caminho da requisição que gerou o erro',
  })
  path: string

  @ApiProperty({
    example: 'GET',
    description: 'Método HTTP da requisição',
  })
  method: string
}

export class RateLimitErrorResponseDto {
  @ApiProperty({
    example: 429,
    description: 'Código de status HTTP',
  })
  statusCode: 429

  @ApiProperty({
    example: 'Too many requests, please try again later',
    description: 'Mensagem de erro de rate limit',
  })
  message: string

  @ApiProperty({
    example: 'Rate Limit Exceeded',
    description: 'Tipo do erro',
  })
  error: string

  @ApiProperty({
    example: '2023-12-01T10:30:00.000Z',
    description: 'Timestamp do erro',
  })
  timestamp: string

  @ApiProperty({
    example: '/api/users',
    description: 'Caminho da requisição que gerou o erro',
  })
  path: string

  @ApiProperty({
    example: 'POST',
    description: 'Método HTTP da requisição',
  })
  method: string
}

export class InternalServerErrorResponseDto {
  @ApiProperty({
    example: 500,
    description: 'Código de status HTTP',
  })
  statusCode: 500

  @ApiProperty({
    example: 'Internal server error',
    description: 'Mensagem de erro interno do servidor',
  })
  message: string

  @ApiProperty({
    example: 'Internal Server Error',
    description: 'Tipo do erro',
  })
  error: string

  @ApiProperty({
    example: '2023-12-01T10:30:00.000Z',
    description: 'Timestamp do erro',
  })
  timestamp: string

  @ApiProperty({
    example: '/api/users',
    description: 'Caminho da requisição que gerou o erro',
  })
  path: string

  @ApiProperty({
    example: 'POST',
    description: 'Método HTTP da requisição',
  })
  method: string
}
