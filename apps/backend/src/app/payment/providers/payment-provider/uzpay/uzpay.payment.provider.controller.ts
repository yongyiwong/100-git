import { Body, Controller, Inject, Logger, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  apiEndpointDecriptionEnum,
  apiPathsEnum,
  apiTagsEnum,
} from '@workspace/enums';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { UzPAYDepositStatusResponseDto } from './dto/uzpay.deposit.status.response.dto';
import { UzPAYWithdrawStatusResponseDto } from './dto/uzpay.withdraw.status.response.dto';
import { UzPAYPaymentProviderService } from './uzpay.payment.provider.service';
import { RequestIpAddress } from '../../../../decorators/request.ip.decorators';

@Controller(apiPathsEnum.payment)
@ApiTags(apiTagsEnum.paymentEndpoints)
export class UzPAYPaymentProviderController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private uzPAYPaymentProviderService: UzPAYPaymentProviderService
  ) {}

  @Post(apiPathsEnum.uzpaycallbackDeposit)
  @ApiOperation({
    description: apiEndpointDecriptionEnum.depositUzPAYCallback,
  })
  async depositCallback(
    @Body() depositStatusResponse: UzPAYDepositStatusResponseDto,
    @RequestIpAddress() ip: string
  ): Promise<string> {
    return this.uzPAYPaymentProviderService.depositCallback(
      depositStatusResponse,
      ip
    );
  }

  @Post(apiPathsEnum.uzpaycallbackWithdraw)
  @ApiOperation({
    description: apiEndpointDecriptionEnum.withdrawUzPAYCallback,
  })
  async withdrawCallback(
    @Body() withdrawStatusResponse: UzPAYWithdrawStatusResponseDto,
    @RequestIpAddress() ip: string
  ): Promise<string> {
    return this.uzPAYPaymentProviderService.withdrawCallback(
      withdrawStatusResponse,
      ip
    );
  }
}
