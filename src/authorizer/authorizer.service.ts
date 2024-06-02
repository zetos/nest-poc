import { Injectable } from '@nestjs/common';
import { fetchRetry } from '../common/util';

@Injectable()
export class AuthorizerService {
  async authorize(): Promise<boolean> {
    const request = new Request(
      'https://run.mocky.io/v3/20b979c1-b861-4be7-a8f6-1cfaedbc00c2',
    );
    const authorizerResponse: { permission: boolean } = await fetchRetry(
      request,
    ).then((response) => response.json());

    return authorizerResponse.permission;
  }
}
