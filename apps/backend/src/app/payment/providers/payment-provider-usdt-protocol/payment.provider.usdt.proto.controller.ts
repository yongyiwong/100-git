import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { apiPathsEnum, apiTagsEnum } from '@workspace/enums';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { PaymentProviderUsdtProtoGetRequestDto } from './dto/payment.provider.usdt.proto.get.request.dto';
import { PaymentProviderUsdtProtoUpdateRequestDto } from './dto/payment.provider.usdt.proto.update.request.dto';
import { PaymentProviderUsdtProtoUpdateResponseDto } from './dto/payment.provider.usdt.proto.update.response.dto';
import { PaymentProviderUsdtProtoService } from './payment.provider.usdt.proto.service';

@Controller(apiPathsEnum.paymentProviderUsdtProto)
@ApiTags(apiTagsEnum.paymentEndpoints)
export class PaymentProviderUsdtProtoController {
  constructor(
    private paymentProviderUsdtProtoService: PaymentProviderUsdtProtoService
  ) {}

  @Get(apiPathsEnum.getPaymentProviderUsdtProtos)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  gets(@Query() query: PaymentProviderUsdtProtoGetRequestDto) {
    return this.paymentProviderUsdtProtoService.findAllByQuery(query);
  }

  @Post(apiPathsEnum.updatePaymentProviderUsdtProtos)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  update(
    @Body() updateRequestDto: PaymentProviderUsdtProtoUpdateRequestDto
  ): Promise<PaymentProviderUsdtProtoUpdateResponseDto> {
    return this.paymentProviderUsdtProtoService.updateByRequest(
      updateRequestDto
    );
  }
}
