import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsIn, IsNumber, IsOptional } from 'class-validator';

export class PaymentProviderChannelGetRequestDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Transform((params) => Number(params.value))
  @IsNumber()
  paymentProviderId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform((params) => Number(params.value))
  @IsNumber()
  @IsIn([1, 2])
  depositOrWithdrawable: number;
}
