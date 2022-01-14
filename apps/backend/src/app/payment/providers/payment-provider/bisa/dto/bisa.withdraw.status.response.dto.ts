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

export enum BisaWithdrawStatusEnum {}

export class BisaWithdrawStatusResponseDto extends PaymentStatusResponseDto {
  id: string;
  transaction_hash: string;
  scaled_amount: number;
  fee: number;
  scaled_fee: number;
  created_at: number;
  status: string;
  withdrawal_key: string;
  coin: string;
  address: string;
  tag: string;
  notification_link: string;
  amount: number;
}
