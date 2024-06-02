import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { AuthorizerService } from '../authorizer/authorizer.service';

@Injectable()
export class TransferService {
  constructor(
    private prisma: PrismaService,
    private authorizer: AuthorizerService,
  ) {}

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

    const authorizerResponse = await this.authorizer.authorize();

    if (authorizerResponse !== true) {
      throw new BadGatewayException(['Authorizer denial.']);
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
