import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTransferDto } from './dto/create-transfer.dto';

@Injectable()
export class TransferService {
  constructor(private prisma: PrismaService) {}

  async createTransfer(dto: CreateTransferDto): Promise<{
    id: number;
    createdAt: Date;
    senderId: number;
    receiverId: number;
    amount: string;
  }> {
    // check if user creditor is common.
    const creditor = await this.prisma.user.findUnique({
      where: { id: dto.creditorId },
      include: { wallet: true },
    });

    console.log('creditor:', creditor);

    if (creditor.type === 'shopkeeper') {
      throw new BadRequestException('Shopkeeper cant be a creditor');
    }

    // check wallet amount
    if (creditor.wallet.balance < dto.amount) {
      throw new BadRequestException('Not enough money');
    }

    // check authorizer
    const authorizerResponse: { permission: boolean } = await fetch(
      'https://run.mocky.io/v3/20b979c1-b861-4be7-a8f6-1cfaedbc00c2',
    ).then((response) => response.json());

    if (authorizerResponse.permission !== true) {
      throw new BadGatewayException('Not enough money');
    }

    const newTransference = await this.prisma.transference.create({
      data: {
        amount: dto.amount,
        senderId: dto.creditorId,
        receiverId: dto.debitorId,
      },
    });

    return { ...newTransference, amount: newTransference.amount.toString() };
  }
}
