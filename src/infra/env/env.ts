import { plainToInstance } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsString, validateSync } from 'class-validator'

export class Env {
  @IsString()
  @IsNotEmpty()
  dbUrl: string

  @IsNumber()
  @IsNotEmpty()
  apiPort: number

  @IsString()
  @IsNotEmpty()
  JWT_PUBLIC_KEY: string

  @IsString()
  @IsNotEmpty()
  JWT_PRIVATE_KEY: string

  @IsString()
  @IsNotEmpty()
  JWT_EXPIRES_IN: string
}

export const env: Env = plainToInstance(Env, {
  apiKey: process.env.API_KEY,
  dbUrl: process.env.DATABASE_URL,
  apiPort: Number(process.env.API_PORT),
  JWT_PUBLIC_KEY: process.env.JWT_PUBLIC_KEY,
  JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
})

const errors = validateSync(env)

if (errors.length > 0) {
  throw new Error(JSON.stringify(errors, null, 2))
}
