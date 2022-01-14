import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { PaymentStatusResponseDto } from '../../payment.status.response.dto';
import { MSZFPaymentStatusEnum } from '../mszf.payment.provider.service';

/*************Example*****************
{
    "gamerOrderId": "D15608558484680374",
    "merchantOrderId": "ORDER001",
    "currencyCode": "CNY",
    "paymentTypeCode": "WECHAT",
    "amount": "100.00",
    "remark": "000354",
    "mp": "testMP",
    "status": "Success",
    "sign": "711c4b90c921d00b17425165b09f49c2"
    }
***************************************/

export class MSZFDepositStatusResponseDto extends PaymentStatusResponseDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  gamerOrderId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  merchantOrderId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  currencyCode: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  paymentTypeCode: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  amount: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  remark: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(MSZFPaymentStatusEnum)
  status: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  mp: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  sign: string;
}
