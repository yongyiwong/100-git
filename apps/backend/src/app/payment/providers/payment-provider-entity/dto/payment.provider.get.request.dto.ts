import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class PaymentProviderGetRequestDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Transform((params) => /true/i.test(params.value))
  @IsBoolean()
  isDepositSupport: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform((params) => /true/i.test(params.value))
  @IsBoolean()
  isWithdrawalSupport: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform((params) => /true/i.test(params.value))
  @IsBoolean()
  isOnlyCardSupport: boolean;
}
