import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TransferModule } from './transfer/transfer.module';
import { UserModule } from './user/user.module';
// import { APP_FILTER } from '@nestjs/core';
// import { PrismaExceptionFilter } from './common/filters';
import { AuthorizerModule } from './authorizer/authorizer.module';
import { DrizzleModule } from './drizzle/drizzle.module';

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
  // providers: [
  //   {
  //     provide: APP_FILTER,
  //     useClass: PrismaExceptionFilter,
  //   },
  // ],
})
export class AppModule {}
