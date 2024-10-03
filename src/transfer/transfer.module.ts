import { Module } from '@nestjs/common';
import { TransferController } from './transfer.controller';
import { TransferService } from './transfer.service';
import { AuthorizerService } from '../authorizer/authorizer.service';
import { DrizzleModule } from '../drizzle/drizzle.module';

@Module({
  controllers: [TransferController],
  providers: [TransferService, AuthorizerService],
  imports: [DrizzleModule],
})
export class TransferModule {}
