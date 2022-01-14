import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsNumberString,
  IsInt,
} from 'class-validator';
import { PaymentStatusResponseDto } from '../../payment.status.response.dto';

export enum JBPWithdrawStatusEnum {
  SUCCESS = 1, // 成功
  FAILED = 0, // 失败
}

export class JBPWithdrawStatusResponseDto extends PaymentStatusResponseDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  companyOrderNum: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  otcOrderNum: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  //@Transform((params) => Number(params.value))
  coinAmount: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  coinSign: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  @Transform((params) => Number(params.value))
  orderType: number;

  @ApiProperty({
    enum: JBPWithdrawStatusEnum,
  })
  @IsNotEmpty()
  @IsEnum(JBPWithdrawStatusEnum)
  @Transform((params) => Number(params.value))
  @IsInt()
  tradeStatus: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  tradeOrderTime: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  //@Transform((params) => Number(params.value))
  unitPrice: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  //@Transform((params) => Number(params.value))
  total: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  //@Transform((params) => Number(params.value))
  successAmount: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  sign: string;
}
