import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { apiPathsEnum, apiTagsEnum } from '@workspace/enums';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { PaymentProviderBankGetRequestDto } from './dto/payment.provider.bank.get.request.dto';
import { PaymentProviderBankUpdateRequestDto } from './dto/payment.provider.bank.update.request.dto';
import { PaymentProviderBankUpdateResponseDto } from './dto/payment.provider.bank.update.response.dto';
import { PaymentProviderBankService } from './payment.provider.bank.service';

@Controller(apiPathsEnum.paymentProviderBank)
@ApiTags(apiTagsEnum.paymentEndpoints)
export class PaymentProviderBankController {
  constructor(private paymentProviderBankService: PaymentProviderBankService) {}

  @Get(apiPathsEnum.getPaymentProviderBanks)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  gets(@Query() query: PaymentProviderBankGetRequestDto) {
    return this.paymentProviderBankService.findAllByQuery(query);
  }

  @Post(apiPathsEnum.updatePaymentProviderBanks)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  update(
    @Body() updateRequestDto: PaymentProviderBankUpdateRequestDto
  ): Promise<PaymentProviderBankUpdateResponseDto> {
    return this.paymentProviderBankService.updateByRequest(updateRequestDto);
  }
}
