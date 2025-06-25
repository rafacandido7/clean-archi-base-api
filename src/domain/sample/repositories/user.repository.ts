import { CreateUserDto } from '@core/dto/user'
import { User } from '@core/entities'

export interface UserRepository {
  create(user: CreateUserDto): Promise<User>
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  findByCPF(cpf: string): Promise<User | null>
}
