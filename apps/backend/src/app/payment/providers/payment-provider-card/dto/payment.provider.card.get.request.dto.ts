import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsIn, IsNumber, IsOptional } from 'class-validator';

export class PaymentProviderCardGetRequestDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Transform((params) => Number(params.value))
  @IsNumber()
  paymentProviderId: number;
}
