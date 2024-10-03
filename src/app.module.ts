import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TransferModule } from './transfer/transfer.module';
import { UserModule } from './user/user.module';
import { APP_FILTER } from '@nestjs/core';
import { AuthorizerModule } from './authorizer/authorizer.module';
import { DrizzleModule } from './drizzle/drizzle.module';
import {
  DatabaseExceptionFilter,
  DrizzleExceptionFilter,
} from './common/filters';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DrizzleModule,
    UserModule,
    TransferModule,
    AuthorizerModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: DrizzleExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: DatabaseExceptionFilter,
    },
  ],
})
export class AppModule {}
