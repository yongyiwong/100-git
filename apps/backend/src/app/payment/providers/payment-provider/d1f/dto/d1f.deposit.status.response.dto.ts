import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { PaymentStatusResponseDto } from '../../payment.status.response.dto';

export class D1FDepositStatusResponseDto extends PaymentStatusResponseDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  orderno: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  customerno: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  customerbillno: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  customerbilltime: string;

  @ApiPropertyOptional()
  @IsString()
  preorderamount: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  orderamount: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  paystatus: string;

  @ApiPropertyOptional()
  @IsString()
  customerextinfo: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  sign: string;
}
