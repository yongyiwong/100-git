import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { apiPathsEnum, apiTagsEnum } from '@workspace/enums';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { PaymentProviderEntityService } from '../payment-provider-entity/Payment.provider.entity.service';
import { PaymentProviderGetRequestDto } from './dto/payment.provider.get.request.dto';
import { PaymentProviderUpdateRequestDto } from './dto/payment.provider.update.request.dto';
import { PaymentProviderUpdateResponseDto } from './dto/payment.provider.update.response.dto';

import { FindOptions, Op } from 'sequelize';

@Controller(apiPathsEnum.paymentProvider)
@ApiTags(apiTagsEnum.paymentEndpoints)
export class PaymentProviderEntityController {
  constructor(private payProviderEntityService: PaymentProviderEntityService) {}

  @Get(apiPathsEnum.getPaymentProviders)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  gets(@Query() query: PaymentProviderGetRequestDto) {
    return this.payProviderEntityService.findAllByQuery(query);
  }

  @Post(apiPathsEnum.updatePaymentProviders)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  update(
    @Body() updateRequestDto: PaymentProviderUpdateRequestDto
  ): Promise<PaymentProviderUpdateResponseDto> {
    return this.payProviderEntityService.update(updateRequestDto);
  }
}
