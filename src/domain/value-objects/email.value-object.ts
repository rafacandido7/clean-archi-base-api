export class Email {
  private readonly _value: string

  constructor(value: string) {
    if (!value) {
      throw new Error('E-mail inválido')
    }

    const normalizedEmail = this.normalize(value)

    if (!this.isValid(normalizedEmail)) {
      throw new Error('E-mail inválido')
    }

    this._value = normalizedEmail
  }

  get value(): string {
    return this._value
  }

  get domain(): string {
    return this._value.split('@')[1]
  }

  get localPart(): string {
    return this._value.split('@')[0]
  }

  private normalize(email: string): string {
    return email.toLowerCase().trim()
  }

  private isValid(email: string): boolean {
    // Regex mais flexível para email, permitindo + e outros caracteres válidos
    const emailRegex = /^[a-zA-Z0-9]([a-zA-Z0-9._+-]*[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9.-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/

    // Verificações adicionais
    if (!emailRegex.test(email)) return false
    if (email.length > 254) return false
    if (email.includes('..')) return false // Pontos consecutivos
    if (email.includes('@.') || email.includes('.@')) return false

    return true
  }

  equals(other: Email): boolean {
    return this._value === other._value
  }

  toString(): string {
    return this._value
  }
}
