import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty } from 'class-validator';

export class CreateBCOrdersDto {
  @ApiProperty()
  @IsNotEmpty()
  orderId: number;

  @ApiProperty()
  @IsNotEmpty()
  depositOrWithdrawable: number;

  @ApiProperty()
  @IsNotEmpty()
  processed: boolean;

  @ApiProperty()
  @IsNotEmpty()
  status: string;
}
