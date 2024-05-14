import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto): Promise<string> {
    console.log('dto:', dto);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        hash: dto.hash,
        name: dto.name,
        cnpj: dto.cnpj,
        cpf: dto.cpf,
        wallet: { create: { balance: dto.balance } },
      },
    });
    console.log('created user:', user);

    return 'Hello World!';
  }
}
