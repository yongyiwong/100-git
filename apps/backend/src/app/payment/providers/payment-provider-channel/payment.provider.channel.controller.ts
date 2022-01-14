import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { apiPathsEnum, apiTagsEnum } from '@workspace/enums';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { ChannelModel } from '../../../models/channel.model';
import { PaymentProviderEntityModel } from '../../../models/payment.provider.entity.model';
import { PaymentProviderChannelGetRequestDto } from './dto/payment.provider.channel.get.request.dto';
import { PaymentProviderChannelUpdateRequestDto } from './dto/payment.provider.channel.update.request.dto';
import { PaymentProviderChannelUpdateResponseDto } from './dto/payment.provider.channel.update.response.dto';
import { PaymentProviderChannelService } from './payment.provider.channel.service';

@Controller(apiPathsEnum.paymentProviderChannel)
@ApiTags(apiTagsEnum.paymentEndpoints)
export class PaymentProviderChannelController {
  constructor(
    private paymentProviderChannelService: PaymentProviderChannelService
  ) {}

  @Get(apiPathsEnum.getPaymentProviderChannels)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  gets(@Query() query: PaymentProviderChannelGetRequestDto) {
    return this.paymentProviderChannelService.findAllByQuery(query);
  }

  @Post(apiPathsEnum.updatePaymentProviderChannels)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  update(
    @Body() updateRequestDto: PaymentProviderChannelUpdateRequestDto
  ): Promise<PaymentProviderChannelUpdateResponseDto> {
    return this.paymentProviderChannelService.updateByRequest(updateRequestDto);
  }
}
