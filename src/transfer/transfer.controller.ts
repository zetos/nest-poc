import { Body, Controller, Post } from '@nestjs/common';
import { TransferService } from './transfer.service';
import { CreateTransferDto } from './dto/create-transfer.dto';

@Controller('transfer')
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  @Post()
  async postTransfer(@Body() dto: CreateTransferDto): Promise<{
    id: number;
    createdAt: Date;
    senderId: number;
    receiverId: number;
    amount: string;
  }> {
    return this.transferService.createTransfer(dto);
  }
}
