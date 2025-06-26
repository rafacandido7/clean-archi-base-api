export class Phone {
  private readonly _value: string

  constructor(value?: string) {
    if (!value) {
      this._value = ''
      return
    }

    const cleanPhone = this.clean(value)

    if (!this.isValid(cleanPhone)) {
      throw new Error('Número de telefone inválido')
    }

    this._value = cleanPhone
  }

  get value(): string {
    return this._value
  }

  get formatted(): string {
    if (!this._value) return ''

    // Remove +55 prefix for formatting
    const phoneWithoutCountry = this._value.replace(/^\+55/, '')

    // Formato: +55 (11) 91234-5678
    if (phoneWithoutCountry.length === 11) { // 2 + 9 dígitos
      return phoneWithoutCountry.replace(/(\d{2})(\d{5})(\d{4})/, '+55 ($1) $2-$3')
    }

    // Formato: +55 (11) 1234-5678
    if (phoneWithoutCountry.length === 10) { // 2 + 8 dígitos
      return phoneWithoutCountry.replace(/(\d{2})(\d{4})(\d{4})/, '+55 ($1) $2-$3')
    }

    return this._value
  }

  get isEmpty(): boolean {
    return this._value === ''
  }

  private clean(phone: string): string {
    // Remove todos os caracteres não numéricos, exceto o +
    const cleaned = phone.replace(/[^\d+]/g, '')

    // Se não começar com +, adiciona +55
    if (!cleaned.startsWith('+')) {
      return `+55${cleaned}`
    }

    return cleaned
  }

  private isValid(phone: string): boolean {
    if (!phone) return true // Phone é opcional

    // Deve começar com +55 seguido de 10 ou 11 dígitos
    const phoneRegex = /^\+55\d{10,11}$/

    // Verificar se não é código de país diferente de +55
    if (phone.startsWith('+') && !phone.startsWith('+55')) {
      return false
    }

    return phoneRegex.test(phone)
  }

  equals(other: Phone): boolean {
    return this._value === other._value
  }

  toString(): string {
    return this.formatted
  }
}
