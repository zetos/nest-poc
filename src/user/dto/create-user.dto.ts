import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';
import { IsCNPJ, IsCPF } from 'src/common/validators';

enum UserRole {
  SHOPKEEPER = 'shopkeeper',
  COMMON = 'common',
}

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  hash: string;

  @IsEnum(UserRole)
  type: UserRole;

  @IsCNPJ()
  @ValidateIf((obj) => obj.type === UserRole.SHOPKEEPER)
  cnpj?: string;

  @IsCPF()
  @ValidateIf((obj) => obj.type === UserRole.COMMON)
  cpf?: string;

  @IsInt()
  @Min(0)
  balance: number;
}
