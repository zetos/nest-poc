import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsCNPJ, IsCPF } from '../../common/validators';

enum UserRole {
  SHOPKEEPER = 'shopkeeper',
  COMMON = 'common',
}

export class CreateUserDto {
  @ApiProperty({
    example: 'foo@bar.com',
    description: 'The email of the user.',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the user.',
  })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({
    example: 'foobar123',
    description: 'A password for the user.',
  })
  @IsNotEmpty()
  @IsString()
  hash!: string;

  @ApiProperty({
    example: 'common',
    description: 'The type of the user, can be "common" or a "shopkeeper"',
    enum: UserRole,
  })
  @IsEnum(UserRole)
  type!: UserRole;

  @ApiPropertyOptional({
    example: '96.886.415/0001-83',
    description: 'The CNPJ of a shopkeeper user.',
  })
  @ValidateIf((obj) => obj.type === UserRole.SHOPKEEPER)
  @IsCNPJ()
  cnpj?: string;

  @ApiPropertyOptional({
    example: '421.923.410-16',
    description: 'The CPF of a shopkeeper user.',
  })
  @ValidateIf((obj) => obj.type === UserRole.COMMON)
  @IsCPF()
  cpf?: string;

  @ApiProperty({
    example: 5000,
    description: 'The money amount of the user.',
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  balance!: number;
}
