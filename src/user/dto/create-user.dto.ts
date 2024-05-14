import {
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

enum UserRole {
  SHOPKEEPER = 'shopkeeper',
  COMMON = 'common',
}

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  hash: string;

  @IsEnum(UserRole)
  type: string;

  @IsString()
  @IsOptional()
  cpf?: string;

  @IsString()
  @IsOptional()
  cnpj?: string;

  @IsInt()
  @Min(0)
  balance: number;
}
