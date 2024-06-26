import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TransferModule } from './transfer/transfer.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { APP_FILTER } from '@nestjs/core';
import { PrismaExceptionFilter } from './common/filters';
import { AuthorizerModule } from './authorizer/authorizer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TransferModule,
    UserModule,
    PrismaModule,
    AuthorizerModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: PrismaExceptionFilter,
    },
  ],
})
export class AppModule {}
