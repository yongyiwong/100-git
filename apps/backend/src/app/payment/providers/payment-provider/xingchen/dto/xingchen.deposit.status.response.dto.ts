import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaymentStatusResponseDto } from '../../payment.status.response.dto';

export enum XingChenDepositStatusEnum {
  PENDING = 0, //为暂未支付
  SUCCESS, // 为已支付
  FAILED, // 超时支付失败
}

export class XingChenDepositStatusResponseDto extends PaymentStatusResponseDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  mch_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  order_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  @Transform((params) => Number(params.value))
  amount: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  bank_mark: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  trade_no: string;

  @ApiProperty({
    enum: XingChenDepositStatusEnum,
  })
  @IsNotEmpty()
  @IsEnum(XingChenDepositStatusEnum)
  @IsInt()
  pay_status: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  pay_time: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  time_stamp: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  sign: string;
}
