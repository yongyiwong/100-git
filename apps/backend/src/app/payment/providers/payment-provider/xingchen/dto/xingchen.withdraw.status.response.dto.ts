import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { PaymentStatusResponseDto } from '../../payment.status.response.dto';

export enum XingChenWithdrawStatusEnum {
  PENDING = 0, //初始状态，处理中
  SUCCESS, // 提现代付成功
  FAILED, // 提现代付失败
}

export class XingChenWithdrawStatusResponseDto extends PaymentStatusResponseDto {
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
  bank: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  bank_site: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  bank_account: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  bank_account_name: string;

  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsString()
  pay_time: string;

  @ApiProperty({
    enum: XingChenWithdrawStatusEnum,
  })
  @IsNotEmpty()
  @IsEnum(XingChenWithdrawStatusEnum)
  @IsInt()
  pay_status: XingChenWithdrawStatusEnum;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  time_stamp: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  sign: string;
}
