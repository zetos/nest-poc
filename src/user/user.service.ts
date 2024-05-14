import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto): Promise<{ id: number; name: string }> {
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

    return { id: user.id, name: user.name };
  }
}
