import { Injectable } from '@nestjs/common';

@Injectable()
export class TransferService {
  postTransfer(): string {
    return 'Hello World!';
  }
}
