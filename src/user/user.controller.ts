import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { UserService } from './user.service';
import { CreateUserDto } from './dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Create a user' })
  @ApiResponse({
    status: 201,
    description: 'Create a user',
    type: CreateUserDto,
  })
  @Post()
  create(@Body() dto: CreateUserDto): Promise<{ id: number; name: string }> {
    if (dto.type === 'common' && dto.cnpj) {
      throw new BadRequestException([
        'CNPJ should be empty for a COMMON user.',
      ]);
    } else if (dto.type === 'shopkeeper' && dto.cpf) {
      throw new BadRequestException([
        'CPF should be empty for a SHOPKEEPER user.',
      ]);
    }

    return this.userService.create(dto);
  }
}
