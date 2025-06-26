import { User } from './user.entity'
import { CPF } from '../value-objects/cpf.value-object'
import { Email } from '../value-objects/email.value-object'
import { Phone } from '../value-objects/phone.value-object'

describe('User Entity', () => {
  const validUserData = {
    id: '507f1f77bcf86cd799439011',
    name: 'João Silva',
    email: 'joao@example.com',
    password: 'hashedPassword123',
    cpf: '11144477735',
    phone: '11987654321',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  }

  describe('User Creation', () => {
    it('should create user with valid data', () => {
      const user = User.create(validUserData)

      expect(user.id).toBe(validUserData.id)
      expect(user.name).toBe(validUserData.name)
      expect(user.email).toBeInstanceOf(Email)
      expect(user.email.value).toBe(validUserData.email)
      expect(user.password).toBe(validUserData.password)
      expect(user.cpf).toBeInstanceOf(CPF)
      expect(user.cpf.value).toBe(validUserData.cpf)
      expect(user.phone).toBeInstanceOf(Phone)
      expect(user.phone.value).toBe('+5511987654321')
      expect(user.createdAt).toBe(validUserData.createdAt)
      expect(user.updatedAt).toBe(validUserData.updatedAt)
    })

    it('should create user without phone', () => {
      const userData = { ...validUserData, phone: undefined }

      const user = User.create(userData)

      expect(user.phone.isEmpty).toBe(true)
      expect(user.hasPhone()).toBe(false)
    })

    it('should create user with default dates when not provided', () => {
      const userData = {
        ...validUserData,
        createdAt: undefined,
        updatedAt: undefined,
      }

      const user = User.create(userData)

      expect(user.createdAt).toBeInstanceOf(Date)
      expect(user.updatedAt).toBeInstanceOf(Date)
    })

    it('should throw error for invalid email', () => {
      const userData = { ...validUserData, email: 'invalid-email' }

      expect(() => User.create(userData)).toThrow('E-mail inválido')
    })

    it('should throw error for invalid CPF', () => {
      const userData = { ...validUserData, cpf: '12345678901' }

      expect(() => User.create(userData)).toThrow('CPF inválido')
    })

    it('should throw error for invalid phone', () => {
      const userData = { ...validUserData, phone: '123' }

      expect(() => User.create(userData)).toThrow('Número de telefone inválido')
    })
  })

  describe('User Methods', () => {
    let user: User

    beforeEach(() => {
      user = User.create(validUserData)
    })

    describe('update', () => {
      it('should update user name', () => {
        const updatedUser = user.update({ name: 'João Santos' })

        expect(updatedUser.name).toBe('João Santos')
        expect(updatedUser.email).toBe(user.email)
        expect(updatedUser.cpf).toBe(user.cpf)
        expect(updatedUser.phone).toBe(user.phone)
        expect(updatedUser.updatedAt).not.toBe(user.updatedAt)
        expect(updatedUser.createdAt).toBe(user.createdAt)
      })

      it('should update user email', () => {
        const updatedUser = user.update({ email: 'joao.santos@example.com' })

        expect(updatedUser.email.value).toBe('joao.santos@example.com')
        expect(updatedUser.name).toBe(user.name)
      })

      it('should update user phone', () => {
        const updatedUser = user.update({ phone: '11876543210' })

        expect(updatedUser.phone.value).toBe('+5511876543210')
        expect(updatedUser.name).toBe(user.name)
      })

      it('should remove phone when empty string provided', () => {
        const updatedUser = user.update({ phone: '' })

        expect(updatedUser.phone.isEmpty).toBe(true)
        expect(updatedUser.hasPhone()).toBe(false)
      })

      it('should update multiple fields', () => {
        const updatedUser = user.update({
          name: 'João Santos',
          email: 'joao.santos@example.com',
          phone: '11876543210',
        })

        expect(updatedUser.name).toBe('João Santos')
        expect(updatedUser.email.value).toBe('joao.santos@example.com')
        expect(updatedUser.phone.value).toBe('+5511876543210')
      })

      it('should throw error for invalid email in update', () => {
        expect(() => user.update({ email: 'invalid-email' })).toThrow('E-mail inválido')
      })

      it('should throw error for invalid phone in update', () => {
        expect(() => user.update({ phone: '123' })).toThrow('Número de telefone inválido')
      })
    })

    describe('hasPhone', () => {
      it('should return true when user has phone', () => {
        expect(user.hasPhone()).toBe(true)
      })

      it('should return false when user has no phone', () => {
        const userWithoutPhone = User.create({ ...validUserData, phone: '' })
        expect(userWithoutPhone.hasPhone()).toBe(false)
      })
    })

    describe('toPublic', () => {
      it('should return public user data without password', () => {
        const publicData = user.toPublic()

        expect(publicData.id).toBe(user.id)
        expect(publicData.name).toBe(user.name)
        expect(publicData.email).toBe(user.email)
        expect(publicData.cpf).toBe(user.cpf)
        expect(publicData.phone).toBe(user.phone)
        expect(publicData.createdAt).toBe(user.createdAt)
        expect(publicData.updatedAt).toBe(user.updatedAt)
        expect('password' in publicData).toBe(false)
      })
    })

    describe('toPlainObject', () => {
      it('should return plain object with primitive values', () => {
        const plainObject = user.toPlainObject()

        expect(plainObject.id).toBe(user.id)
        expect(plainObject.name).toBe(user.name)
        expect(plainObject.email).toBe(user.email.value)
        expect(plainObject.password).toBe(user.password)
        expect(plainObject.cpf).toBe(user.cpf.value)
        expect(plainObject.phone).toBe(user.phone.value)
        expect(plainObject.createdAt).toBe(user.createdAt)
        expect(plainObject.updatedAt).toBe(user.updatedAt)
      })
    })
  })

  describe('Edge Cases', () => {
    it('should handle user with empty phone', () => {
      const userData = { ...validUserData, phone: undefined }
      const user = User.create(userData)

      expect(user.phone.isEmpty).toBe(true)
      expect(user.hasPhone()).toBe(false)
      expect(user.toPlainObject().phone).toBe('')
    })

    it('should preserve original dates when updating other fields', () => {
      const user = User.create(validUserData)
      const originalCreatedAt = user.createdAt
      const originalUpdatedAt = user.updatedAt

      // Wait a bit to ensure different timestamp
      const updatedUser = user.update({ name: 'New Name' })

      expect(updatedUser.createdAt).toBe(originalCreatedAt)
      expect(updatedUser.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime())
    })

    it('should handle email normalization in creation', () => {
      const userData = { ...validUserData, email: 'JOAO@EXAMPLE.COM' }
      const user = User.create(userData)

      expect(user.email.value).toBe('joao@example.com')
    })

    it('should handle CPF formatting in creation', () => {
      const userData = { ...validUserData, cpf: '111.444.777-35' }
      const user = User.create(userData)

      expect(user.cpf.value).toBe('11144477735')
      expect(user.cpf.formatted).toBe('111.444.777-35')
    })
  })
})
