import { IsInt, Min } from 'class-validator';

export class CreateTransferDto {
  @IsInt()
  creditorId: number;

  @IsInt()
  debitorId: number;

  @IsInt()
  @Min(1)
  amount: number;
}
