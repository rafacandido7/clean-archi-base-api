import { UserDocument } from '../schemas/user.schema'
import { User } from '../../../../domain/entities'

export class UserMapper {
  static toEntity(document: UserDocument): User {
    return User.create({
      id: document._id?.toString() || '',
      name: document.name,
      email: document.email,
      password: document.password,
      cpf: document.cpf,
      phone: document.phone || '',
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    })
  }

  static toSchema(entity: User) {
    const plainObject = entity.toPlainObject()
    return {
      name: plainObject.name,
      email: plainObject.email,
      password: plainObject.password,
      cpf: plainObject.cpf,
      phone: plainObject.phone,
      createdAt: plainObject.createdAt,
      updatedAt: plainObject.updatedAt,
    }
  }
}
