import { Injectable } from '@nestjs/common'
import { User } from '../../domain/entities'
import { UserRepository, CreateUserData, UpdateUserData, UserFilters, PaginationOptions } from '../../domain/repositories'
import { HashGenerator } from '../../domain/sample/cryptography'

export interface CreateUserRequest {
  name: string
  email: string
  password: string
  cpf: string
  phone?: string
}

export interface UpdateUserRequest {
  name?: string
  email?: string
  phone?: string
}

export interface UserResponse {
  id: string
  name: string
  email: string
  cpf: string
  phone: string
  createdAt: Date
  updatedAt: Date
}

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashGenerator: HashGenerator,
  ) {}

  async createUser(request: CreateUserRequest): Promise<UserResponse> {
    // Verificar se usuário já existe
    const [emailExists, cpfExists] = await Promise.all([
      this.userRepository.existsByEmail(request.email),
      this.userRepository.existsByCPF(request.cpf),
    ])

    if (emailExists) {
      throw new Error(`E-mail já cadastrado: ${request.email}`)
    }

    if (cpfExists) {
      throw new Error(`CPF já cadastrado: ${request.cpf}`)
    }

    // Hash da senha
    const hashedPassword = await this.hashGenerator.hash(request.password)

    // Criar usuário
    const userData: CreateUserData = {
      ...request,
      password: hashedPassword,
    }

    const user = await this.userRepository.create(userData)
    return this.toResponse(user)
  }

  async getUserById(id: string): Promise<UserResponse | null> {
    const user = await this.userRepository.findById(id)
    return user ? this.toResponse(user) : null
  }

  async getUserByEmail(email: string): Promise<UserResponse | null> {
    const user = await this.userRepository.findByEmail(email)
    return user ? this.toResponse(user) : null
  }

  async getUserByCPF(cpf: string): Promise<UserResponse | null> {
    const user = await this.userRepository.findByCPF(cpf)
    return user ? this.toResponse(user) : null
  }

  async updateUser(id: string, request: UpdateUserRequest): Promise<UserResponse | null> {
    // Verificar se o novo email já existe (se fornecido)
    if (request.email) {
      const existingUser = await this.userRepository.findByEmail(request.email)
      if (existingUser && existingUser.id !== id) {
        throw new Error(`E-mail já cadastrado: ${request.email}`)
      }
    }

    const user = await this.userRepository.update(id, request)
    return user ? this.toResponse(user) : null
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.userRepository.delete(id)
  }

  async getUsers(filters?: UserFilters, pagination?: PaginationOptions) {
    const result = await this.userRepository.findMany(filters, pagination)

    return {
      ...result,
      data: result.data.map(user => this.toResponse(user)),
    }
  }

  private toResponse(user: User): UserResponse {
    return {
      id: user.id,
      name: user.name,
      email: user.email.value,
      cpf: user.cpf.formatted,
      phone: user.phone.formatted,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }
}
