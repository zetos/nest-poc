import { Module } from '@nestjs/common';
import { TransferController } from './transfer.controller';
import { TransferService } from './transfer.service';
import { AuthorizerService } from '../authorizer/authorizer.service';

@Module({
  controllers: [TransferController],
  providers: [TransferService, AuthorizerService],
})
export class TransferModule {}
