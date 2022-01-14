import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsInt,
  IsNumberString,
} from 'class-validator';
import { PaymentStatusResponseDto } from '../../payment.status.response.dto';
import { Transform } from 'class-transformer';

export enum JBPDepositStatusEnum {
  SUCCESS = 1, // 成功
  FAILED = 0, // 失败
}

export class JBPDepositStatusResponseDto extends PaymentStatusResponseDto {
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
    enum: JBPDepositStatusEnum,
  })
  @IsNotEmpty()
  @IsEnum(JBPDepositStatusEnum)
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
