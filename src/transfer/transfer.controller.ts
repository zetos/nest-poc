import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TransferService } from './transfer.service';
import { CreateTransferDto } from './dto/create-transfer.dto';

@ApiTags('transfer')
@Controller('transfer')
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  @ApiOperation({ summary: 'Create a transference' })
  @ApiResponse({
    status: 201,
    description: 'Make a money transference between valid users',
    type: CreateTransferDto,
  })
  @Post()
  async postTransfer(@Body() dto: CreateTransferDto): Promise<{
    id: number;
    createdAt: Date;
    creditorId: number;
    debitorId: number;
    amount: string;
  }> {
    return this.transferService.createTransfer(dto);
  }
}
