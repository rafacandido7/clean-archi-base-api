import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, ClientSession } from 'mongoose'
import { UserRepository, CreateUserData, UpdateUserData, UserFilters, PaginationOptions, PaginatedResult } from '../../../../domain/repositories'
import { User } from '../../../../domain/entities'
import { UserMapper } from '../mappers/user.mapper'
import { UserDocument } from '../schemas/user.schema'

@Injectable()
export class MongoUserRepository extends UserRepository {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
  ) {
    super()
  }

  async create(userData: CreateUserData): Promise<User> {
    const createdUser = new this.userModel({
      name: userData.name,
      email: userData.email,
      password: userData.password,
      cpf: userData.cpf,
      phone: userData.phone || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const savedUser = await createdUser.save()
    return UserMapper.toEntity(savedUser)
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.userModel.findById(id).lean()
    return user ? UserMapper.toEntity(user) : null
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email }).lean()
    return user ? UserMapper.toEntity(user) : null
  }

  async findByCPF(cpf: string): Promise<User | null> {
    const user = await this.userModel.findOne({ cpf }).lean()
    return user ? UserMapper.toEntity(user) : null
  }

  async update(id: string, userData: UpdateUserData): Promise<User | null> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        id,
        { ...userData, updatedAt: new Date() },
        { new: true },
      )
      .lean()

    return updatedUser ? UserMapper.toEntity(updatedUser) : null
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.userModel.findByIdAndDelete(id)
    return !!result
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.userModel.countDocuments({ email })
    return count > 0
  }

  async existsByCPF(cpf: string): Promise<boolean> {
    const count = await this.userModel.countDocuments({ cpf })
    return count > 0
  }

  async findMany(
    filters?: UserFilters,
    pagination?: PaginationOptions,
  ): Promise<PaginatedResult<User>> {
    const query = this.buildQuery(filters)

    const page = pagination?.page || 1
    const limit = pagination?.limit || 10
    const skip = (page - 1) * limit

    const [users, total] = await Promise.all([
      this.userModel
        .find(query)
        .sort(this.buildSort(pagination))
        .skip(skip)
        .limit(limit)
        .lean(),
      this.userModel.countDocuments(query),
    ])

    const totalPages = Math.ceil(total / limit)

    return {
      data: users.map(user => UserMapper.toEntity(user)),
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    }
  }

  async count(filters?: UserFilters): Promise<number> {
    const query = this.buildQuery(filters)
    return this.userModel.countDocuments(query)
  }

  private buildQuery(filters?: UserFilters): any {
    const query: any = {}

    if (filters?.name) {
      query.name = { $regex: filters.name, $options: 'i' }
    }

    if (filters?.email) {
      query.email = filters.email
    }

    if (filters?.cpf) {
      query.cpf = filters.cpf
    }

    if (filters?.createdAfter || filters?.createdBefore) {
      query.createdAt = {}
      if (filters.createdAfter) {
        query.createdAt.$gte = filters.createdAfter
      }
      if (filters.createdBefore) {
        query.createdAt.$lte = filters.createdBefore
      }
    }

    return query
  }

  private buildSort(pagination?: PaginationOptions): any {
    if (!pagination?.sortBy) {
      return { createdAt: -1 }
    }

    const sortOrder = pagination.sortOrder === 'asc' ? 1 : -1
    return { [pagination.sortBy]: sortOrder }
  }
}
