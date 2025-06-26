import { ApiProperty } from '@nestjs/swagger'

export class UserResponseDto {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'ID único do usuário (ObjectId do MongoDB)',
  })
  id: string

  @ApiProperty({
    example: 'João Silva',
    description: 'Nome completo do usuário',
  })
  name: string

  @ApiProperty({
    example: 'joao.silva@email.com',
    description: 'Endereço de e-mail do usuário',
  })
  email: string

  @ApiProperty({
    example: '111.444.777-35',
    description: 'CPF formatado do usuário',
  })
  cpf: string

  @ApiProperty({
    example: '+55 (11) 98765-4321',
    description: 'Telefone formatado do usuário (opcional)',
    required: false,
  })
  phone?: string

  @ApiProperty({
    example: '2023-12-01T10:30:00.000Z',
    description: 'Data de criação do usuário',
  })
  createdAt: Date

  @ApiProperty({
    example: '2023-12-01T10:30:00.000Z',
    description: 'Data da última atualização do usuário',
  })
  updatedAt: Date
}

export class PaginatedUserResponseDto {
  @ApiProperty({
    type: [UserResponseDto],
    description: 'Lista de usuários',
  })
  data: UserResponseDto[]

  @ApiProperty({
    example: 150,
    description: 'Total de usuários encontrados',
  })
  total: number

  @ApiProperty({
    example: 1,
    description: 'Página atual',
  })
  page: number

  @ApiProperty({
    example: 10,
    description: 'Número de itens por página',
  })
  limit: number

  @ApiProperty({
    example: 15,
    description: 'Total de páginas',
  })
  totalPages: number

  @ApiProperty({
    example: true,
    description: 'Indica se há próxima página',
  })
  hasNext: boolean

  @ApiProperty({
    example: false,
    description: 'Indica se há página anterior',
  })
  hasPrev: boolean
}

export class LoginResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Token JWT para autenticação',
  })
  accessToken: string

  @ApiProperty({
    example: 'Bearer',
    description: 'Tipo do token',
  })
  tokenType: string

  @ApiProperty({
    example: 900,
    description: 'Tempo de expiração do token em segundos',
  })
  expiresIn: number

  @ApiProperty({
    type: UserResponseDto,
    description: 'Dados do usuário autenticado',
  })
  user: UserResponseDto
}
