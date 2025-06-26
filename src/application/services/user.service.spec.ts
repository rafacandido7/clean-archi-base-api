import { describe, it, expect, beforeEach, vi } from 'vitest'
import { UserService, CreateUserRequest, UpdateUserRequest } from './user.service'
import { UserRepository } from '../../domain/repositories'
import { HashGenerator } from '../../domain/sample/cryptography'
import { User } from '../../domain/entities'

// Mock implementations
const mockUserRepository = {
  findById: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  findByEmail: vi.fn(),
  findByCPF: vi.fn(),
  findMany: vi.fn(),
  existsByEmail: vi.fn(),
  existsByCPF: vi.fn(),
  count: vi.fn(),
} as any

const mockHashGenerator = {
  hash: vi.fn(),
} as any

describe('UserService', () => {
  let userService: UserService
  let mockUser: User

  beforeEach(() => {
    userService = new UserService(mockUserRepository, mockHashGenerator)

    mockUser = User.create({
      id: '507f1f77bcf86cd799439011',
      name: 'João Silva',
      email: 'joao@example.com',
      password: 'hashedPassword123',
      cpf: '11144477735',
      phone: '11987654321',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    })

    // Reset all mocks
    vi.clearAllMocks()
  })

  describe('createUser', () => {
    const createUserRequest: CreateUserRequest = {
      name: 'João Silva',
      email: 'joao@example.com',
      password: 'password123',
      cpf: '11144477735',
      phone: '11987654321',
    }

    it('should create user successfully', async () => {
      // Arrange
      mockUserRepository.existsByEmail.mockResolvedValue(false)
      mockUserRepository.existsByCPF.mockResolvedValue(false)
      mockHashGenerator.hash.mockResolvedValue('hashedPassword123')
      mockUserRepository.create.mockResolvedValue(mockUser)

      // Act
      const result = await userService.createUser(createUserRequest)

      // Assert
      expect(mockUserRepository.existsByEmail).toHaveBeenCalledWith('joao@example.com')
      expect(mockUserRepository.existsByCPF).toHaveBeenCalledWith('11144477735')
      expect(mockHashGenerator.hash).toHaveBeenCalledWith('password123')
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        ...createUserRequest,
        password: 'hashedPassword123',
      })

      expect(result).toEqual({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email.value,
        cpf: mockUser.cpf.formatted,
        phone: mockUser.phone.formatted,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      })
    })

    it('should throw error when email already exists', async () => {
      // Arrange
      mockUserRepository.existsByEmail.mockResolvedValue(true)
      mockUserRepository.existsByCPF.mockResolvedValue(false)

      // Act & Assert
      await expect(userService.createUser(createUserRequest)).rejects.toThrow(
        'E-mail já cadastrado: joao@example.com',
      )

      expect(mockUserRepository.existsByEmail).toHaveBeenCalledWith('joao@example.com')
      expect(mockUserRepository.existsByCPF).toHaveBeenCalledWith('11144477735')
      expect(mockHashGenerator.hash).not.toHaveBeenCalled()
      expect(mockUserRepository.create).not.toHaveBeenCalled()
    })

    it('should throw error when CPF already exists', async () => {
      // Arrange
      mockUserRepository.existsByEmail.mockResolvedValue(false)
      mockUserRepository.existsByCPF.mockResolvedValue(true)

      // Act & Assert
      await expect(userService.createUser(createUserRequest)).rejects.toThrow(
        'CPF já cadastrado: 11144477735',
      )

      expect(mockUserRepository.existsByEmail).toHaveBeenCalledWith('joao@example.com')
      expect(mockUserRepository.existsByCPF).toHaveBeenCalledWith('11144477735')
      expect(mockHashGenerator.hash).not.toHaveBeenCalled()
      expect(mockUserRepository.create).not.toHaveBeenCalled()
    })

    it('should create user without phone', async () => {
      // Arrange
      const requestWithoutPhone = { ...createUserRequest }
      delete requestWithoutPhone.phone

      mockUserRepository.existsByEmail.mockResolvedValue(false)
      mockUserRepository.existsByCPF.mockResolvedValue(false)
      mockHashGenerator.hash.mockResolvedValue('hashedPassword123')

      const userWithoutPhone = User.create({
        ...mockUser.toPlainObject(),
        phone: '',
      })
      mockUserRepository.create.mockResolvedValue(userWithoutPhone)

      // Act
      const result = await userService.createUser(requestWithoutPhone)

      // Assert
      expect(result.phone).toBe('')
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        ...requestWithoutPhone,
        password: 'hashedPassword123',
      })
    })
  })

  describe('getUserById', () => {
    it('should return user when found', async () => {
      // Arrange
      mockUserRepository.findById.mockResolvedValue(mockUser)

      // Act
      const result = await userService.getUserById('507f1f77bcf86cd799439011')

      // Assert
      expect(mockUserRepository.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011')
      expect(result).toEqual({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email.value,
        cpf: mockUser.cpf.formatted,
        phone: mockUser.phone.formatted,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      })
    })

    it('should return null when user not found', async () => {
      // Arrange
      mockUserRepository.findById.mockResolvedValue(null)

      // Act
      const result = await userService.getUserById('nonexistent')

      // Assert
      expect(mockUserRepository.findById).toHaveBeenCalledWith('nonexistent')
      expect(result).toBeNull()
    })
  })

  describe('getUserByEmail', () => {
    it('should return user when found', async () => {
      // Arrange
      mockUserRepository.findByEmail.mockResolvedValue(mockUser)

      // Act
      const result = await userService.getUserByEmail('joao@example.com')

      // Assert
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('joao@example.com')
      expect(result).not.toBeNull()
      expect(result!.email).toBe(mockUser.email.value)
    })

    it('should return null when user not found', async () => {
      // Arrange
      mockUserRepository.findByEmail.mockResolvedValue(null)

      // Act
      const result = await userService.getUserByEmail('nonexistent@example.com')

      // Assert
      expect(result).toBeNull()
    })
  })

  describe('getUserByCPF', () => {
    it('should return user when found', async () => {
      // Arrange
      mockUserRepository.findByCPF.mockResolvedValue(mockUser)

      // Act
      const result = await userService.getUserByCPF('11144477735')

      // Assert
      expect(mockUserRepository.findByCPF).toHaveBeenCalledWith('11144477735')
      expect(result).not.toBeNull()
      expect(result!.cpf).toBe(mockUser.cpf.formatted)
    })

    it('should return null when user not found', async () => {
      // Arrange
      mockUserRepository.findByCPF.mockResolvedValue(null)

      // Act
      const result = await userService.getUserByCPF('12345678909')

      // Assert
      expect(result).toBeNull()
    })
  })

  describe('updateUser', () => {
    const updateRequest: UpdateUserRequest = {
      name: 'João Santos',
      email: 'joao.santos@example.com',
      phone: '11876543210',
    }

    it('should update user successfully', async () => {
      // Arrange
      const updatedUser = mockUser.update(updateRequest)
      mockUserRepository.findByEmail.mockResolvedValue(null) // Email not taken
      mockUserRepository.update.mockResolvedValue(updatedUser)

      // Act
      const result = await userService.updateUser('507f1f77bcf86cd799439011', updateRequest)

      // Assert
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('joao.santos@example.com')
      expect(mockUserRepository.update).toHaveBeenCalledWith('507f1f77bcf86cd799439011', updateRequest)
      expect(result).not.toBeNull()
      expect(result!.name).toBe('João Santos')
    })

    it('should throw error when new email is already taken by another user', async () => {
      // Arrange
      const anotherUser = User.create({
        ...mockUser.toPlainObject(),
        id: 'another-id',
        email: 'joao.santos@example.com',
      })
      mockUserRepository.findByEmail.mockResolvedValue(anotherUser)

      // Act & Assert
      await expect(
        userService.updateUser('507f1f77bcf86cd799439011', updateRequest),
      ).rejects.toThrow('E-mail já cadastrado: joao.santos@example.com')

      expect(mockUserRepository.update).not.toHaveBeenCalled()
    })

    it('should allow updating to same email', async () => {
      // Arrange
      const updateWithSameEmail = { name: 'João Santos' }
      mockUserRepository.update.mockResolvedValue(mockUser.update(updateWithSameEmail))

      // Act
      const result = await userService.updateUser('507f1f77bcf86cd799439011', updateWithSameEmail)

      // Assert
      expect(mockUserRepository.findByEmail).not.toHaveBeenCalled()
      expect(result).not.toBeNull()
    })

    it('should return null when user not found', async () => {
      // Arrange
      mockUserRepository.findByEmail.mockResolvedValue(null)
      mockUserRepository.update.mockResolvedValue(null)

      // Act
      const result = await userService.updateUser('nonexistent', updateRequest)

      // Assert
      expect(result).toBeNull()
    })
  })

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      // Arrange
      mockUserRepository.delete.mockResolvedValue(true)

      // Act
      const result = await userService.deleteUser('507f1f77bcf86cd799439011')

      // Assert
      expect(mockUserRepository.delete).toHaveBeenCalledWith('507f1f77bcf86cd799439011')
      expect(result).toBe(true)
    })

    it('should return false when user not found', async () => {
      // Arrange
      mockUserRepository.delete.mockResolvedValue(false)

      // Act
      const result = await userService.deleteUser('nonexistent')

      // Assert
      expect(result).toBe(false)
    })
  })

  describe('getUsers', () => {
    it('should return paginated users', async () => {
      // Arrange
      const paginatedResult = {
        data: [mockUser],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      }
      mockUserRepository.findMany.mockResolvedValue(paginatedResult)

      // Act
      const result = await userService.getUsers()

      // Assert
      expect(mockUserRepository.findMany).toHaveBeenCalledWith(undefined, undefined)
      expect(result.data).toHaveLength(1)
      expect(result.data[0]).toEqual({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email.value,
        cpf: mockUser.cpf.formatted,
        phone: mockUser.phone.formatted,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      })
    })

    it('should pass filters and pagination to repository', async () => {
      // Arrange
      const filters = { name: 'João' }
      const pagination = { page: 2, limit: 5 }
      mockUserRepository.findMany.mockResolvedValue({
        data: [],
        total: 0,
        page: 2,
        limit: 5,
        totalPages: 0,
        hasNext: false,
        hasPrev: true,
      })

      // Act
      await userService.getUsers(filters, pagination)

      // Assert
      expect(mockUserRepository.findMany).toHaveBeenCalledWith(filters, pagination)
    })
  })
})
