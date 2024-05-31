import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthorizerService {
  async authorize(): Promise<boolean> {
    const authorizerResponse: { permission: boolean } = await fetch(
      'https://run.mocky.io/v3/20b979c1-b861-4be7-a8f6-1cfaedbc00c2',
    ).then((response) => response.json());

    return authorizerResponse.permission;
  }
}
