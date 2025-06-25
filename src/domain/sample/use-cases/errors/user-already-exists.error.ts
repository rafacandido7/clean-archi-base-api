import { UseCaseError } from '@core/errors/use-case-error'

export class UserAlreadyExistsError extends Error implements UseCaseError {
  constructor(message: string) {
    super(`User already exists: ${message}`)
  }
}
