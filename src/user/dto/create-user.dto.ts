import {
  IsEmail,
  IsEnum,
  IsInt,
  IsString,
  Min,
  ValidateIf,
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
  @ValidateIf((obj) => obj.type === UserRole.SHOPKEEPER)
  cnpj?: string;

  @IsString()
  @ValidateIf((obj) => obj.type === UserRole.COMMON)
  cpf?: string;

  @IsInt()
  @Min(0)
  balance: number;
}
