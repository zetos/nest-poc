import {
  BadGatewayException,
  BadRequestException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';

import { CreateTransferDto } from './dto/create-transfer.dto';
import { AuthorizerService } from '../authorizer/authorizer.service';
import { DrizzleDB } from '../../drizzle/types/drizzle';
import { users, wallet, transferences } from '../../drizzle/schema';
import { DRIZZLE } from '../drizzle/drizzle.module';

@Injectable()
export class TransferService {
  constructor(
    private authorizer: AuthorizerService,

    @Inject(DRIZZLE)
    private db: DrizzleDB,
  ) {}

  async createTransfer(dto: CreateTransferDto): Promise<{
    id: number;
    createdAt: Date;
    creditorId: number;
    debitorId: number;
    amount: string;
  }> {
    // const creditor = await this.prisma.user.findUnique({
    //   where: { id: dto.creditorId },
    //   include: { wallet: true },
    // });

    const creditor = await this.db
      .select()
      .from(users)
      .leftJoin(wallet, eq(wallet.userId, users.id))
      .where(eq(users.id, dto.creditorId))
      .execute();

    if (creditor.length === 0) {
      throw new BadRequestException(['creditorId not found.']);
    }

    const creditorUser = creditor[0].users;
    const creditorWallet = creditor[0].wallet;

    if (creditorUser.type === 'shopkeeper') {
      throw new BadRequestException(['creditorId is a shopkeeper.']);
    }

    if (!creditorWallet || creditorWallet.balance < dto.amount) {
      throw new BadRequestException(['amount is too high.']);
    }

    const authorizerResponse = await this.authorizer.authorize();

    if (authorizerResponse !== true) {
      throw new BadGatewayException(['Authorizer denial.']);
    }

    // const [newTransference, _cred, _deb] = await this.prisma.$transaction([
    //   this.prisma.transference.create({
    //     data: {
    //       amount: dto.amount,
    //       creditorId: dto.creditorId,
    //       debitorId: dto.debitorId,
    //     },
    //   }),
    //   this.prisma.wallet.update({
    //     where: { userId: dto.creditorId },
    //     data: { balance: { decrement: dto.amount } },
    //   }),
    //   this.prisma.wallet.update({
    //     where: { userId: dto.debitorId },
    //     data: { balance: { increment: dto.amount } },
    //   }),
    // ]);

    const [newTransference, _cred, _deb] = await this.db.transaction(
      async (tx) => {
        const tran = await tx
          .insert(transferences)
          .values({
            amount: BigInt(dto.amount),
            creditorId: dto.creditorId,
            debitorId: dto.debitorId,
          })
          .returning();

        const _cred = await tx
          .update(wallet)
          .set({
            balance: creditorWallet.balance - BigInt(dto.amount),
          })
          .where(eq(wallet.userId, dto.creditorId))
          .execute();

        const _deb = await tx
          .select()
          .from(wallet)
          .where(eq(wallet.userId, dto.debitorId))
          .execute();

        if (_deb.length === 0) {
          throw new BadRequestException(['debitorId not found.']);
        }

        return [tran, _cred, _deb];
      },
    );

    return {
      ...newTransference[0],
      amount: newTransference[0].amount.toString(),
    };
  }
}
