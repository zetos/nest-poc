import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransferDto {
  @IsInt()
  @ApiProperty({
    example: 1,
    description: 'The id of a creditor (common user).',
  })
  creditorId!: number;

  @ApiProperty({
    example: 2,
    description: 'The id of a debitor (any user).',
  })
  @IsInt()
  debitorId!: number;

  @ApiProperty({
    example: 100,
    description:
      'The amount of money in cents that the creditor wants to transfer.',
  })
  @IsInt()
  @Min(1)
  amount!: number;
}
