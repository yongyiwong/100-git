import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { PaymentStatusResponseDto } from '../../payment.status.response.dto';

export enum UzPAYDepositStatusEnum {
  VERIFIED = 'verified', //已完成
  REVOKED = 'revoked', // 被撒销
  TIMEOUT = 'timeout', // 逾时
  PROCESSING = 'processing', //處理中
}

export class UzPAYDepositStatusResponseDto extends PaymentStatusResponseDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  amount: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  oid: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  orderid: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  userid: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  service: string;

  @ApiProperty({
    enum: UzPAYDepositStatusEnum,
  })
  @IsNotEmpty()
  @IsEnum(UzPAYDepositStatusEnum)
  @IsString()
  status: string;

  @ApiProperty()
  @IsNotEmpty()
  //@IsString()
  created_time: string;

  @ApiPropertyOptional()
  @IsOptional()
  //@IsNumber()
  verified_time: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  extend: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  sign: string;
}
