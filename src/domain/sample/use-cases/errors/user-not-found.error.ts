import { UseCaseError } from '@core/errors/use-case-error'

export class UserNotFoundError extends Error implements UseCaseError {
  constructor(message: string) {
    super(`User not found${message}`)
  }
}
