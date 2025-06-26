export class CPF {
  private readonly _value: string

  constructor(value: string) {
    if (!value) {
      throw new Error('CPF inválido')
    }

    const cleanCpf = this.clean(value)

    if (!this.isValid(cleanCpf)) {
      throw new Error('CPF inválido')
    }

    this._value = cleanCpf
  }

  get value(): string {
    return this._value
  }

  get formatted(): string {
    return this._value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  private clean(cpf: string): string {
    return cpf.replace(/\D/g, '')
  }

  private isValid(cpf: string): boolean {
    if (!cpf || cpf.length !== 11) {
      return false
    }

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) {
      return false
    }

    // Validação do primeiro dígito verificador
    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i)
    }
    let remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== parseInt(cpf.charAt(9))) return false

    // Validação do segundo dígito verificador
    sum = 0
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i)
    }
    remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== parseInt(cpf.charAt(10))) return false

    return true
  }

  equals(other: CPF): boolean {
    return this._value === other._value
  }

  toString(): string {
    return this.formatted
  }
}
