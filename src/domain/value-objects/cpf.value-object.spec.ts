import { CPF } from './cpf.value-object'

describe('CPF Value Object', () => {
  describe('Valid CPFs', () => {
    const validCPFs = [
      '11144477735',
      '111.444.777-35',
      '12345678909',
      '123.456.789-09',
      '98765432100',
      '987.654.321-00',
    ]

    it.each(validCPFs)('should create CPF with valid value: %s', (cpfValue) => {
      expect(() => new CPF(cpfValue)).not.toThrow()

      const cpf = new CPF(cpfValue)
      expect(cpf.value).toBeValidCPF()
      expect(cpf.value).toHaveLength(11)
      expect(cpf.value).toMatch(/^\d{11}$/)
    })

    it('should format CPF correctly', () => {
      const cpf = new CPF('11144477735')
      expect(cpf.formatted).toBe('111.444.777-35')
    })

    it('should return clean value without formatting', () => {
      const cpf = new CPF('111.444.777-35')
      expect(cpf.value).toBe('11144477735')
    })
  })

  describe('Invalid CPFs', () => {
    const invalidCPFs = [
      '',
      '123',
      '12345678901', // Invalid check digits
      '11111111111', // All same digits
      '00000000000', // All zeros
      '12345678900', // Invalid second digit
      'abc.def.ghi-jk', // Non-numeric
      '123.456.789-0', // Too short
      '123.456.789-012', // Too long
    ]

    it.each(invalidCPFs)('should throw error for invalid CPF: %s', (cpfValue) => {
      expect(() => new CPF(cpfValue)).toThrow('CPF inválido')
    })
  })

  describe('CPF Methods', () => {
    it('should compare CPFs correctly', () => {
      const cpf1 = new CPF('11144477735')
      const cpf2 = new CPF('111.444.777-35')
      const cpf3 = new CPF('12345678909')

      expect(cpf1.equals(cpf2)).toBe(true)
      expect(cpf1.equals(cpf3)).toBe(false)
    })

    it('should convert to string with formatting', () => {
      const cpf = new CPF('11144477735')
      expect(cpf.toString()).toBe('111.444.777-35')
    })

    it('should clean CPF input correctly', () => {
      const cpf = new CPF('  111.444.777-35  ')
      expect(cpf.value).toBe('11144477735')
    })
  })

  describe('Edge Cases', () => {
    it('should handle CPF with extra spaces', () => {
      const cpf = new CPF(' 111.444.777-35 ')
      expect(cpf.value).toBe('11144477735')
      expect(cpf.formatted).toBe('111.444.777-35')
    })

    it('should handle CPF with different separators', () => {
      const cpf = new CPF('111 444 777 35')
      expect(cpf.value).toBe('11144477735')
    })

    it('should handle null and undefined', () => {
      expect(() => new CPF(null as any)).toThrow('CPF inválido')
      expect(() => new CPF(undefined as any)).toThrow('CPF inválido')
    })
  })
})
