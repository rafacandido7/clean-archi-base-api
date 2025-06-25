import { Injectable } from '@nestjs/common'

import { CreateUserDto } from '@core/dto/user'
import { User } from '@core/entities'

import { HashGenerator } from '@domain/sample/cryptography'
import { UserRepository } from '@domain/sample/repositories'
import { UserAlreadyExistsError } from '../errors/user-already-exists.error'

@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashGenerator: HashGenerator,
  ) {}

  async execute(
    data: CreateUserDto,
  ): Promise<{ user: Omit<User, 'password'> }> {
    const [cpfAlreadyExists, emailAlreadyExists] = await Promise.all([
      this.userRepository.findByCPF(data.cpf),
      this.userRepository.findByEmail(data.email),
    ])

    if (cpfAlreadyExists) {
      throw new UserAlreadyExistsError(`CPF já cadastrado: ${data.cpf}`)
    }

    if (emailAlreadyExists) {
      throw new UserAlreadyExistsError(`E-mail já cadastrado: ${data.email}`)
    }

    const hashedPassword = await this.hashGenerator.hash(data.password)

    const user = await this.userRepository.create({
      ...data,
      password: hashedPassword,
    })

    const { password, ...userData } = user

    return { user: userData }
  }
}
