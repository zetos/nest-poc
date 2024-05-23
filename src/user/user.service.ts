import { Injectable } from '@nestjs/common';
import * as argon from 'argon2';

import { CreateUserDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto): Promise<{ id: number; name: string }> {
    const argonHash = await argon.hash(dto.hash);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        hash: argonHash,
        name: dto.name,
        cnpj: dto.cnpj,
        cpf: dto.cpf,
        type: dto.type,
        wallet: { create: { balance: dto.balance } },
      },
    });

    return { id: user.id, name: user.name };
  }
}
