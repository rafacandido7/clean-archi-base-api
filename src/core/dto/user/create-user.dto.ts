import { IsCPF } from '@core/decorators/validators'
import { ApiProperty } from '@nestjs/swagger'
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator'
import { Transform } from 'class-transformer'

export class CreateUserDto {
  @ApiProperty({
    example: 'João Silva',
    description: 'Nome completo do usuário',
    minLength: 2,
    maxLength: 100,
  })
  @IsString({ message: 'Nome deve ser uma string' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @Length(2, 100, { message: 'Nome deve ter entre 2 e 100 caracteres' })
  @Matches(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s'.-]+$/, {
    message: 'Nome deve conter apenas letras, espaços, acentos, apostrofes, pontos e hífens',
  })
  @Transform(({ value }) => value?.trim())
  name: string

  @ApiProperty({
    example: 'joao.silva@email.com',
    description: 'Endereço de e-mail válido',
    maxLength: 254,
  })
  @IsEmail({}, { message: 'E-mail deve ter um formato válido' })
  @IsNotEmpty({ message: 'E-mail é obrigatório' })
  @Length(5, 254, { message: 'E-mail deve ter entre 5 e 254 caracteres' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string

  @ApiProperty({
    example: 'MinhaSenh@123',
    description: 'Senha segura com pelo menos 8 caracteres, incluindo maiúscula, minúscula, número e símbolo',
    minLength: 8,
    maxLength: 128,
  })
  @IsString({ message: 'Senha deve ser uma string' })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @Length(8, 128, { message: 'Senha deve ter entre 8 e 128 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'Senha deve conter pelo menos: 1 letra minúscula, 1 maiúscula, 1 número e 1 símbolo (@$!%*?&)',
  })
  password: string

  @ApiProperty({
    example: '123.456.789-00',
    description: 'CPF válido no formato XXX.XXX.XXX-XX ou apenas números',
  })
  @IsString({ message: 'CPF deve ser uma string' })
  @IsCPF({ message: 'CPF deve ser válido' })
  @IsNotEmpty({ message: 'CPF é obrigatório' })
  @Transform(({ value }) => value?.replace(/\D/g, ''))
  cpf: string

  @ApiProperty({
    example: '+55 (11) 91234-5678',
    description: 'Número de telefone brasileiro com DDD',
    required: false,
  })
  @IsString({ message: 'Telefone deve ser uma string' })
  @IsOptional()
  @Matches(/^(\+55\s?)?\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/, {
    message: 'Telefone deve ser um número brasileiro válido com DDD',
  })
  @Transform(({ value }) => {
    if (!value) return value
    // Remove tudo exceto números e +
    const cleaned = value.replace(/[^\d+]/g, '')
    // Adiciona +55 se não tiver código do país
    return cleaned.startsWith('+') ? cleaned : `+55${cleaned}`
  })
  phone?: string
}
