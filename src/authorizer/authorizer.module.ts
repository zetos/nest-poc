import { Module } from '@nestjs/common';
import { AuthorizerService } from './authorizer.service';

@Module({
  providers: [AuthorizerService],
})
export class AuthorizerModule {}
