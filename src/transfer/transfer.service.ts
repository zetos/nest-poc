import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransferDto } from './dto/create-transfer.dto';

@Injectable()
export class TransferService {
  constructor(private prisma: PrismaService) {}

  async createTransfer(dto: CreateTransferDto): Promise<{
    id: number;
    createdAt: Date;
    creditorId: number;
    debitorId: number;
    amount: string;
  }> {
    const creditor = await this.prisma.user.findUnique({
      where: { id: dto.creditorId },
      include: { wallet: true },
    });

    if (!creditor) {
      throw new BadRequestException(['creditorId not found.']);
    }

    if (creditor.type === 'shopkeeper') {
      throw new BadRequestException(['creditorId is a shopkeeper.']);
    }

    if (creditor.wallet.balance < dto.amount) {
      throw new BadRequestException(['amount is too high.']);
    }

    // TODO: authorizer service
    const authorizerResponse: { permission: boolean } = await fetch(
      'https://run.mocky.io/v3/20b979c1-b861-4be7-a8f6-1cfaedbc00c2',
    ).then((response) => response.json());

    if (authorizerResponse.permission !== true) {
      throw new BadGatewayException('Authorizer denial.');
    }

    const newTransference = await this.prisma.transference.create({
      data: {
        amount: dto.amount,
        creditorId: dto.creditorId,
        debitorId: dto.debitorId,
      },
    });

    // TODO: ch amount type to Int
    return { ...newTransference, amount: newTransference.amount.toString() };
  }
}
