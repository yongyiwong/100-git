import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { apiPathsEnum, apiTagsEnum } from '@workspace/enums';
import * as moment from 'moment';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { PaymentProviderCardCreateRequestDto } from './dto/payment.provider.card.create.request.dto';
import { PaymentProviderCardCreateResponseDto } from './dto/payment.provider.card.create.response.dto';
import { PaymentProviderCardDeleteRequestDto } from './dto/payment.provider.card.delete.request.dto';
import { PaymentProviderCardDeleteResponseDto } from './dto/payment.provider.card.delete.response.dto';
import { PaymentProviderCardGetRequestDto } from './dto/payment.provider.card.get.request.dto';
import { PaymentProviderCardUpdateRequestDto } from './dto/payment.provider.card.update.request.dto';
import { PaymentProviderCardUpdateResponseDto } from './dto/payment.provider.card.update.response.dto';
import { PaymentProviderCardService } from './payment.provider.card.service';

@Controller(apiPathsEnum.paymentProviderCard)
@ApiTags(apiTagsEnum.paymentEndpoints)
export class PaymentProviderCardController {
  constructor(private paymentProviderCardService: PaymentProviderCardService) {}

  @Get(apiPathsEnum.getPaymentProviderCards)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  gets(@Query() query: PaymentProviderCardGetRequestDto) {
    //return this.paymentProviderCardService.findAllByQuery(query);
    return this.paymentProviderCardService.findAllWithUsed({
      day: moment().utcOffset('+08:00').format('MM/DD/YYYY'),
      providerId: query.paymentProviderId,
    });
  }

  @Post(apiPathsEnum.createPaymentProviderCards)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(
    @Body() createRequestDto: PaymentProviderCardCreateRequestDto
  ): Promise<PaymentProviderCardCreateResponseDto> {
    return this.paymentProviderCardService.createByRequest(createRequestDto);
  }

  @Post(apiPathsEnum.updatePaymentProviderCards)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  update(
    @Body() updateRequestDto: PaymentProviderCardUpdateRequestDto
  ): Promise<PaymentProviderCardUpdateResponseDto> {
    return this.paymentProviderCardService.updateByRequest(updateRequestDto);
  }

  @Post(apiPathsEnum.deletePaymentProviderCards)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  delete(
    @Body()
    deleteRequest: PaymentProviderCardDeleteRequestDto
  ): Promise<PaymentProviderCardDeleteResponseDto> {
    return this.paymentProviderCardService.deleteByRequest(deleteRequest);
  }
}
