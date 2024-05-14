import { Controller, Post } from '@nestjs/common';
import { TransferService } from './transfer.service';

@Controller('transfer')
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  @Post()
  async postTransfer(): Promise<string> {
    return this.transferService.postTransfer();
  }
}
