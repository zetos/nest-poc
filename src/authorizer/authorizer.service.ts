import { BadGatewayException, Injectable } from '@nestjs/common';

// import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthorizerService {
  //   constructor(private prisma: PrismaService) {}

  async authorize(): Promise<boolean> {
    const authorizerResponse: { permission: boolean } = await fetch(
      'https://run.mocky.io/v3/20b979c1-b861-4be7-a8f6-1cfaedbc00c2',
    ).then((response) => response.json());

    if (authorizerResponse.permission !== true) {
      throw new BadGatewayException('Authorizer denial.');
    }

    return authorizerResponse.permission;
  }
}
