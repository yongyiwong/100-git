import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { PaymentStatusResponseDto } from '../../payment.status.response.dto';

export enum HengXinWithdrawStatusEnum {
  PROCESSING = 0,
  SUCCESS = 1,
  FAILED = 2,
}

export class HengXinWithdrawStatusResponseData {
  merOrderNo: string;
  orderState: number;
  sign: string;
  orderNo: string;
  amount: number;
}

export class HengXinWithdrawStatusResponseDto extends PaymentStatusResponseDto {
  // @ApiProperty()
  // @IsNotEmpty()
  // @IsString()
  merOrderNo: string;

  // @ApiProperty()
  // @IsNotEmpty()
  // @IsString()
  merId: string;

  // @ApiProperty()
  // @IsNotEmpty()
  // @IsString()
  data: string;
}
