import { ApiProperty } from '@nestjs/swagger'
import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator'
import { Transform } from 'class-transformer'

export class UpdateUserDto {
  @ApiProperty({
    example: 'João Santos Silva',
    description: 'Nome completo do usuário',
    minLength: 2,
    maxLength: 100,
    required: false,
  })
  @IsString({ message: 'Nome deve ser uma string' })
  @IsOptional()
  @Length(2, 100, { message: 'Nome deve ter entre 2 e 100 caracteres' })
  @Matches(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s'.-]+$/, {
    message: 'Nome deve conter apenas letras, espaços, acentos, apostrofes, pontos e hífens',
  })
  @Transform(({ value }) => value?.trim())
  name?: string

  @ApiProperty({
    example: 'joao.santos@email.com',
    description: 'Novo endereço de e-mail válido',
    maxLength: 254,
    required: false,
  })
  @IsEmail({}, { message: 'E-mail deve ter um formato válido' })
  @IsOptional()
  @Length(5, 254, { message: 'E-mail deve ter entre 5 e 254 caracteres' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email?: string

  @ApiProperty({
    example: '+55 (11) 98765-4321',
    description: 'Número de telefone brasileiro com DDD (opcional)',
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
