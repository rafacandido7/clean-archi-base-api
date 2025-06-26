// Global test setup for Vitest
import 'reflect-metadata'
import { vi } from 'vitest'

// Extend Vitest matchers
expect.extend({
  toBeValidCPF(received: string) {
    // Remove formatting
    const cleanCpf = received.replace(/\D/g, '')

    if (cleanCpf.length !== 11) {
      return {
        message: () => `Expected ${received} to be a valid CPF`,
        pass: false,
      }
    }

    // Check if all digits are the same
    if (/^(\d)\1{10}$/.test(cleanCpf)) {
      return {
        message: () => `Expected ${received} to be a valid CPF`,
        pass: false,
      }
    }

    // Validate first check digit
    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCpf.charAt(i)) * (10 - i)
    }
    let remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== parseInt(cleanCpf.charAt(9))) {
      return {
        message: () => `Expected ${received} to be a valid CPF`,
        pass: false,
      }
    }

    // Validate second check digit
    sum = 0
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCpf.charAt(i)) * (11 - i)
    }
    remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== parseInt(cleanCpf.charAt(10))) {
      return {
        message: () => `Expected ${received} to be a valid CPF`,
        pass: false,
      }
    }

    return {
      message: () => `Expected ${received} not to be a valid CPF`,
      pass: true,
    }
  },

  toBeValidEmail(received: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const isValid = emailRegex.test(received) && received.length <= 254

    return {
      message: () => `Expected ${received} ${isValid ? 'not ' : ''}to be a valid email`,
      pass: isValid,
    }
  },
})

// Declare custom matchers for TypeScript
declare module 'vitest' {
  interface Assertion<T = any> {
    toBeValidCPF(): T
    toBeValidEmail(): T
  }
  interface AsymmetricMatchersContaining {
    toBeValidCPF(): any
    toBeValidEmail(): any
  }
}

// Mock console methods in tests (optional)
// vi.spyOn(console, 'log').mockImplementation(() => {})
// vi.spyOn(console, 'warn').mockImplementation(() => {})
// vi.spyOn(console, 'error').mockImplementation(() => {})
