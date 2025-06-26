import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
} from '@nestjs/swagger'
import { CreateUserDto } from '@core/dto/user/create-user.dto'
import { UpdateUserDto } from '@core/dto/user/update-user.dto'
import {
  UserResponseDto,
  PaginatedUserResponseDto,
} from '@core/dto/user/user-response.dto'
import {
  ErrorResponseDto,
  ValidationErrorResponseDto,
  UnauthorizedErrorResponseDto,
  NotFoundErrorResponseDto,
  RateLimitErrorResponseDto,
} from '@core/dto/common/error-response.dto'
// import { UserService } from '@application/services/user.service'
// import { JwtAuthGuard } from '@infra/auth/jwt-auth.guard'

@ApiTags('Users')
@Controller('users')
@ApiHeader({
  name: 'X-Request-ID',
  description: 'ID único da requisição (gerado automaticamente se não fornecido)',
  required: false,
})
export class UsersController {
  // constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Criar novo usuário',
    description: `
Cria um novo usuário no sistema com validação completa.

### Validações aplicadas:
- **Nome**: 2-100 caracteres, apenas letras, espaços e acentos
- **Email**: Formato válido, normalizado para lowercase
- **Senha**: Mínimo 8 caracteres com maiúscula, minúscula, número e símbolo
- **CPF**: Validação completa com dígitos verificadores
- **Telefone**: Formato brasileiro com DDD (opcional)

### Regras de negócio:
- Email deve ser único no sistema
- CPF deve ser único no sistema
- Senha é automaticamente criptografada
- Telefone é formatado automaticamente
    `,
  })
  @ApiBody({
    type: CreateUserDto,
    description: 'Dados do usuário a ser criado',
    examples: {
      completo: {
        summary: 'Usuário completo',
        description: 'Exemplo com todos os campos preenchidos',
        value: {
          name: 'João Silva Santos',
          email: 'joao.silva@email.com',
          password: 'MinhaSenh@123',
          cpf: '111.444.777-35',
          phone: '(11) 98765-4321',
        },
      },
      semTelefone: {
        summary: 'Usuário sem telefone',
        description: 'Exemplo sem telefone (campo opcional)',
        value: {
          name: 'Maria Oliveira',
          email: 'maria.oliveira@email.com',
          password: 'SenhaSegur@456',
          cpf: '123.456.789-09',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou email/CPF já existente',
    type: ValidationErrorResponseDto,
  })
  @ApiResponse({
    status: 429,
    description: 'Rate limit excedido',
    type: RateLimitErrorResponseDto,
  })
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    // return this.userService.createUser(createUserDto)
    throw new Error('Not implemented yet')
  }

  @Get()
  // @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Listar usuários',
    description: `
Retorna uma lista paginada de usuários com filtros opcionais.

### Filtros disponíveis:
- **name**: Busca parcial por nome
- **email**: Busca parcial por email

### Paginação:
- **page**: Página atual (padrão: 1)
- **limit**: Itens por página (padrão: 10, máximo: 100)

### Ordenação:
- **sortBy**: Campo para ordenação (name, email, createdAt)
- **sortOrder**: Ordem (asc, desc)
    `,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número da página (padrão: 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Itens por página (padrão: 10, máximo: 100)',
    example: 10,
  })
  @ApiQuery({
    name: 'name',
    required: false,
    type: String,
    description: 'Filtro por nome (busca parcial)',
    example: 'João',
  })
  @ApiQuery({
    name: 'email',
    required: false,
    type: String,
    description: 'Filtro por email (busca parcial)',
    example: 'joao@',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['name', 'email', 'createdAt'],
    description: 'Campo para ordenação',
    example: 'createdAt',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['asc', 'desc'],
    description: 'Ordem da ordenação',
    example: 'desc',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuários retornada com sucesso',
    type: PaginatedUserResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticação inválido ou ausente',
    type: UnauthorizedErrorResponseDto,
  })
  @ApiResponse({
    status: 429,
    description: 'Rate limit excedido',
    type: RateLimitErrorResponseDto,
  })
  async getUsers(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('name') name?: string,
    @Query('email') email?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ): Promise<PaginatedUserResponseDto> {
    // const filters = { name, email }
    // const pagination = { page, limit }
    // const sort = { sortBy, sortOrder }

    // return this.userService.getUsers(filters, pagination)
    throw new Error('Not implemented yet')
  }

  @Get(':id')
  // @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Buscar usuário por ID',
    description: `
Retorna os dados de um usuário específico pelo seu ID.

### Parâmetros:
- **id**: ID único do usuário (ObjectId do MongoDB)

### Retorno:
- Dados completos do usuário (exceto senha)
- Status 404 se o usuário não for encontrado
    `,
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID único do usuário (ObjectId do MongoDB)',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário encontrado',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticação inválido ou ausente',
    type: UnauthorizedErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
    type: NotFoundErrorResponseDto,
  })
  @ApiResponse({
    status: 429,
    description: 'Rate limit excedido',
    type: RateLimitErrorResponseDto,
  })
  async getUserById(@Param('id') id: string): Promise<UserResponseDto> {
    // const user = await this.userService.getUserById(id)
    // if (!user) {
    //   throw new Error('Usuário não encontrado')
    // }
    // return user
    throw new Error('Not implemented yet')
  }

  @Put(':id')
  // @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Atualizar usuário',
    description: `
Atualiza os dados de um usuário existente.

### Campos atualizáveis:
- **name**: Nome completo
- **email**: Endereço de email (deve ser único)
- **phone**: Telefone (opcional)

### Validações:
- Mesmas validações da criação se aplicam
- Email deve ser único (exceto o próprio usuário)
- Campos não fornecidos permanecem inalterados

### Regras de negócio:
- Apenas o próprio usuário pode atualizar seus dados
- Email alterado deve ser único no sistema
- Data de atualização é automaticamente definida
    `,
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID único do usuário a ser atualizado',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiBody({
    type: UpdateUserDto,
    description: 'Dados a serem atualizados (todos opcionais)',
    examples: {
      nomeEmail: {
        summary: 'Atualizar nome e email',
        value: {
          name: 'João Santos Silva',
          email: 'joao.santos@email.com',
        },
      },
      apenasNome: {
        summary: 'Atualizar apenas nome',
        value: {
          name: 'João Silva Santos',
        },
      },
      telefone: {
        summary: 'Adicionar/atualizar telefone',
        value: {
          phone: '(11) 99999-8888',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário atualizado com sucesso',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou email já existente',
    type: ValidationErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticação inválido ou ausente',
    type: UnauthorizedErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
    type: NotFoundErrorResponseDto,
  })
  @ApiResponse({
    status: 429,
    description: 'Rate limit excedido',
    type: RateLimitErrorResponseDto,
  })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    // const user = await this.userService.updateUser(id, updateUserDto)
    // if (!user) {
    //   throw new Error('Usuário não encontrado')
    // }
    // return user
    throw new Error('Not implemented yet')
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  // @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Excluir usuário',
    description: `
Remove um usuário do sistema permanentemente.

### Atenção:
- Esta ação é **irreversível**
- Todos os dados do usuário serão perdidos
- Apenas o próprio usuário pode excluir sua conta

### Processo:
1. Verifica se o usuário existe
2. Remove todos os dados relacionados
3. Retorna status 204 (No Content) em caso de sucesso
    `,
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID único do usuário a ser excluído',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 204,
    description: 'Usuário excluído com sucesso',
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticação inválido ou ausente',
    type: UnauthorizedErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
    type: NotFoundErrorResponseDto,
  })
  @ApiResponse({
    status: 429,
    description: 'Rate limit excedido',
    type: RateLimitErrorResponseDto,
  })
  async deleteUser(@Param('id') id: string): Promise<void> {
    // const deleted = await this.userService.deleteUser(id)
    // if (!deleted) {
    //   throw new Error('Usuário não encontrado')
    // }
    throw new Error('Not implemented yet')
  }
}
