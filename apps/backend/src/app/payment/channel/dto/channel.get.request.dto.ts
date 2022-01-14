import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsIn, IsNumber, IsOptional } from 'class-validator';

export class ChannelGetRequestDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Transform((params) => Number(params.value))
  @IsNumber()
  @IsIn([1, 2])
  depositOrWithdrawable: number;
}
