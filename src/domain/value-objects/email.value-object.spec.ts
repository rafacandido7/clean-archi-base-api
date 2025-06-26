import { Email } from './email.value-object'

describe('Email Value Object', () => {
  describe('Valid Emails', () => {
    const validEmails = [
      'test@example.com',
      'user.name@domain.co.uk',
      'user+tag@example.org',
      'user123@test-domain.com',
      'a@b.co',
      'very.long.email.address@very.long.domain.name.com',
    ]

    it.each(validEmails)('should create Email with valid value: %s', (emailValue) => {
      expect(() => new Email(emailValue)).not.toThrow()

      const email = new Email(emailValue)
      expect(email.value).toBeValidEmail()
      expect(email.value).toBe(emailValue.toLowerCase().trim())
    })

    it('should normalize email to lowercase', () => {
      const email = new Email('TEST@EXAMPLE.COM')
      expect(email.value).toBe('test@example.com')
    })

    it('should trim whitespace', () => {
      const email = new Email('  test@example.com  ')
      expect(email.value).toBe('test@example.com')
    })
  })

  describe('Invalid Emails', () => {
    const invalidEmails = [
      '',
      'invalid',
      '@example.com',
      'test@',
      'test.example.com',
      'test@.com',
      'test@com',
      'test..test@example.com',
      'test@example..com',
      'test @example.com',
      'test@exam ple.com',
      'a'.repeat(255) + '@example.com', // Too long
    ]

    it.each(invalidEmails)('should throw error for invalid email: %s', (emailValue) => {
      expect(() => new Email(emailValue)).toThrow('E-mail inválido')
    })
  })

  describe('Email Methods', () => {
    it('should extract domain correctly', () => {
      const email = new Email('user@example.com')
      expect(email.domain).toBe('example.com')
    })

    it('should extract local part correctly', () => {
      const email = new Email('user.name@example.com')
      expect(email.localPart).toBe('user.name')
    })

    it('should compare emails correctly', () => {
      const email1 = new Email('test@example.com')
      const email2 = new Email('TEST@EXAMPLE.COM')
      const email3 = new Email('other@example.com')

      expect(email1.equals(email2)).toBe(true)
      expect(email1.equals(email3)).toBe(false)
    })

    it('should convert to string', () => {
      const email = new Email('TEST@EXAMPLE.COM')
      expect(email.toString()).toBe('test@example.com')
    })
  })

  describe('Edge Cases', () => {
    it('should handle email with plus sign', () => {
      const email = new Email('user+tag@example.com')
      expect(email.localPart).toBe('user+tag')
      expect(email.domain).toBe('example.com')
    })

    it('should handle email with numbers', () => {
      const email = new Email('user123@example123.com')
      expect(email.value).toBe('user123@example123.com')
    })

    it('should handle email with hyphens', () => {
      const email = new Email('user-name@test-domain.com')
      expect(email.value).toBe('user-name@test-domain.com')
    })

    it('should handle null and undefined', () => {
      expect(() => new Email(null as any)).toThrow('E-mail inválido')
      expect(() => new Email(undefined as any)).toThrow('E-mail inválido')
    })
  })
})
