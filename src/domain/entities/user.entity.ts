import { CPF, Email, Phone } from '../value-objects'

export class User {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: Email,
    public readonly password: string,
    public readonly cpf: CPF,
    public readonly phone: Phone,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  // Factory method para criar um usuário
  static create(props: {
    id: string
    name: string
    email: string
    password: string
    cpf: string
    phone?: string
    createdAt?: Date
    updatedAt?: Date
  }): User {
    return new User(
      props.id,
      props.name,
      new Email(props.email),
      props.password,
      new CPF(props.cpf),
      new Phone(props.phone),
      props.createdAt,
      props.updatedAt,
    )
  }

  // Método para atualizar dados do usuário
  update(props: {
    name?: string
    email?: string
    phone?: string
  }): User {
    return new User(
      this.id,
      props.name ?? this.name,
      props.email ? new Email(props.email) : this.email,
      this.password,
      this.cpf,
      props.phone !== undefined ? new Phone(props.phone) : this.phone,
      this.createdAt,
      new Date(),
    )
  }

  // Método para verificar se o usuário tem telefone
  hasPhone(): boolean {
    return !this.phone.isEmpty
  }

  // Método para obter dados sem senha
  toPublic(): UserPublicData {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      cpf: this.cpf,
      phone: this.phone,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }

  // Método para serialização
  toPlainObject() {
    return {
      id: this.id,
      name: this.name,
      email: this.email.value,
      password: this.password,
      cpf: this.cpf.value,
      phone: this.phone.value,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }
}

export interface UserPublicData {
  id: string
  name: string
  email: Email
  cpf: CPF
  phone: Phone
  createdAt: Date
  updatedAt: Date
}
