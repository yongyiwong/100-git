import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { PaymentStatusResponseDto } from '../../payment.status.response.dto';

export enum SDDWithdrawStatusEnum {}

export class SDDWithdrawStatusResponseDto extends PaymentStatusResponseDto {}
