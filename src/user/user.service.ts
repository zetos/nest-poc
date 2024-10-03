import { Inject, Injectable } from '@nestjs/common';
import * as argon from 'argon2';

import { CreateUserDto } from './dto';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { DrizzleDB } from '../../drizzle/types/drizzle';
import { users, wallet } from '../../drizzle/schema';

@Injectable()
export class UserService {
  constructor(
    @Inject(DRIZZLE)
    private db: DrizzleDB,
  ) {}

  async create(dto: CreateUserDto): Promise<{ id: number; name: string }> {
    const argonHash = await argon.hash(dto.hash);

    const user = await this.db
      .insert(users)
      .values({
        email: dto.email,
        hash: argonHash,
        name: dto.name,
        cnpj: dto.cnpj,
        cpf: dto.cpf,
        type: dto.type,
      })
      .returning();

    await this.db
      .insert(wallet)
      .values({
        userId: user[0].id,
        balance: BigInt(dto.balance),
      })
      .returning();

    return { id: user[0].id, name: user[0].name };
  }
}
