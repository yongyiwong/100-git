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

export enum BisaDepositStatusEnum {}

export class BisaDepositStatusResponseDto extends PaymentStatusResponseDto {
  id: string;
  coin: string;
  transaction_hash: string;
  address: string;
  amount: number;
  scaled_amount: number;
  fee: number;
  scaled_fee: number;
  created_at: number;
  confirmed_at: number;
  on_chain_at: number;
  last_tried_at: number;
  notified_at: number;
  error_count: number;
  last_error?: {
    status: number;
    text: string;
    body: string;
  };
  order_id: string;
  order_key: string;
  cumulative_amount: number;
  scaled_cumulative_amount: number;
}
