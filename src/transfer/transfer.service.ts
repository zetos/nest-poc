import {
  BadGatewayException,
  BadRequestException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';

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

    const newTransference = await this.db
      .transaction(async (tx) => {
        const tran = await tx
          .insert(transferences)
          .values({
            amount: BigInt(dto.amount),
            creditorId: dto.creditorId,
            debitorId: dto.debitorId,
            createdAt: sql`CURRENT_TIMESTAMP`,
          })
          .returning()
          .catch((e) => {
            console.error('>>> BAD TRANSFERENCE !!!!', e);
            throw e;
          });

        const _cred = await tx
          .update(wallet)
          .set({
            balance: sql`${wallet.balance} - ${BigInt(dto.amount)}`,
          })
          .where(eq(wallet.userId, dto.creditorId))
          .execute()
          .catch((e) => {
            console.error('>>> BAD WALLET UPDATE !!!!');
            throw e;
          });

        const _deb = await tx
          .select()
          .from(wallet)
          .where(eq(wallet.userId, dto.debitorId))
          .execute()
          .catch((e) => {
            console.error('>>> BAD DEBITOR !!!!');
            throw e;
          });

        if (_deb.length === 0) {
          throw new BadRequestException(['debitorId not found.']);
        }

        return tran[0];
      })
      .catch((e) => {
        console.error('>>>> TRANSACTION ERR !!');
        throw e;
      });

    return {
      ...newTransference,
      amount: newTransference.amount.toString(),
    };
  }
}
