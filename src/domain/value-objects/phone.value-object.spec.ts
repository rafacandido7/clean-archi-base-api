import { Phone } from './phone.value-object'

describe('Phone Value Object', () => {
  describe('Valid Phones', () => {
    const validPhones = [
      '+5511987654321',
      '+551187654321',
      '11987654321',
      '1187654321',
      '(11) 98765-4321',
      '(11) 8765-4321',
      '+55 (11) 98765-4321',
      '+55 11 98765-4321',
    ]

    it.each(validPhones)('should create Phone with valid value: %s', (phoneValue) => {
      expect(() => new Phone(phoneValue)).not.toThrow()

      const phone = new Phone(phoneValue)
      expect(phone.value).toMatch(/^\+55\d{10,11}$/)
      expect(phone.isEmpty).toBe(false)
    })

    it('should format mobile phone correctly', () => {
      const phone = new Phone('11987654321')
      expect(phone.formatted).toBe('+55 (11) 98765-4321')
    })

    it('should format landline phone correctly', () => {
      const phone = new Phone('1187654321')
      expect(phone.formatted).toBe('+55 (11) 8765-4321')
    })

    it('should add +55 prefix when missing', () => {
      const phone = new Phone('11987654321')
      expect(phone.value).toBe('+5511987654321')
    })

    it('should preserve +55 prefix when present', () => {
      const phone = new Phone('+5511987654321')
      expect(phone.value).toBe('+5511987654321')
    })
  })

  describe('Invalid Phones', () => {
    const invalidPhones = [
      '123', // Too short
      '12345678901234', // Too long
      '+1234567890123', // Wrong country code
      'abcdefghijk', // Non-numeric
      '+55119876543210', // Too many digits
    ]

    it.each(invalidPhones)('should throw error for invalid phone: %s', (phoneValue) => {
      expect(() => new Phone(phoneValue)).toThrow('Número de telefone inválido')
    })
  })

  describe('Empty Phone', () => {
    it('should create empty phone when no value provided', () => {
      const phone = new Phone()
      expect(phone.value).toBe('')
      expect(phone.formatted).toBe('')
      expect(phone.isEmpty).toBe(true)
    })

    it('should create empty phone when empty string provided', () => {
      const phone = new Phone('')
      expect(phone.value).toBe('')
      expect(phone.isEmpty).toBe(true)
    })

    it('should create empty phone when undefined provided', () => {
      const phone = new Phone(undefined)
      expect(phone.value).toBe('')
      expect(phone.isEmpty).toBe(true)
    })
  })

  describe('Phone Methods', () => {
    it('should compare phones correctly', () => {
      const phone1 = new Phone('11987654321')
      const phone2 = new Phone('+55 (11) 98765-4321')
      const phone3 = new Phone('11876543210')

      expect(phone1.equals(phone2)).toBe(true)
      expect(phone1.equals(phone3)).toBe(false)
    })

    it('should convert to string with formatting', () => {
      const phone = new Phone('11987654321')
      expect(phone.toString()).toBe('+55 (11) 98765-4321')
    })

    it('should handle empty phone toString', () => {
      const phone = new Phone()
      expect(phone.toString()).toBe('')
    })
  })

  describe('Phone Cleaning', () => {
    it('should clean phone with spaces and parentheses', () => {
      const phone = new Phone('(11) 98765-4321')
      expect(phone.value).toBe('+5511987654321')
    })

    it('should clean phone with dots and hyphens', () => {
      const phone = new Phone('11.98765.4321')
      expect(phone.value).toBe('+5511987654321')
    })

    it('should clean phone with mixed formatting', () => {
      const phone = new Phone('+55 (11) 9.8765-4321')
      expect(phone.value).toBe('+5511987654321')
    })
  })

  describe('Edge Cases', () => {
    it('should handle phone with extra spaces', () => {
      const phone = new Phone('  11987654321  ')
      expect(phone.value).toBe('+5511987654321')
    })

    it('should handle null', () => {
      const phone = new Phone(null as any)
      expect(phone.isEmpty).toBe(true)
    })

    it('should differentiate mobile and landline formatting', () => {
      const mobile = new Phone('11987654321') // 9 digits
      const landline = new Phone('1187654321') // 8 digits

      expect(mobile.formatted).toBe('+55 (11) 98765-4321')
      expect(landline.formatted).toBe('+55 (11) 8765-4321')
    })
  })
})
