import { User } from '../entities'
import { PaginatedResult, PaginationOptions } from './base.repository'

export interface CreateUserData {
  name: string
  email: string
  password: string
  cpf: string
  phone?: string
}

export interface UpdateUserData {
  name?: string
  email?: string
  phone?: string
}

export interface UserFilters {
  name?: string
  email?: string
  cpf?: string
  createdAfter?: Date
  createdBefore?: Date
}

export abstract class UserRepository {
  abstract findById(id: string): Promise<User | null>
  abstract create(userData: CreateUserData): Promise<User>
  abstract update(id: string, userData: UpdateUserData): Promise<User | null>
  abstract delete(id: string): Promise<boolean>

  // Métodos específicos do User
  abstract findByEmail(email: string): Promise<User | null>
  abstract findByCPF(cpf: string): Promise<User | null>
  abstract findMany(
    filters?: UserFilters,
    pagination?: PaginationOptions
  ): Promise<PaginatedResult<User>>
  abstract existsByEmail(email: string): Promise<boolean>
  abstract existsByCPF(cpf: string): Promise<boolean>
  abstract count(filters?: UserFilters): Promise<number>
}
