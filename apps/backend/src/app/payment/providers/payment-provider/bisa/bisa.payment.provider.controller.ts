import {
  Body,
  Controller,
  HttpCode,
  Inject,
  Logger,
  Post,
  Headers,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  apiEndpointDecriptionEnum,
  apiPathsEnum,
  apiTagsEnum,
} from '@workspace/enums';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { BisaDepositStatusResponseDto } from './dto/bisa.deposit.status.response.dto';
import { BisaWithdrawStatusResponseDto } from './dto/bisa.withdraw.status.response.dto';
import { BisaPaymentProviderService } from './bisa.payment.provider.service';
import { RequestIpAddress } from '../../../../decorators/request.ip.decorators';

@Controller(apiPathsEnum.payment)
@ApiTags(apiTagsEnum.paymentEndpoints)
export class BisaPaymentProviderController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private bisaPaymentProviderService: BisaPaymentProviderService
  ) {}

  @Post(apiPathsEnum.bisacallbackDeposit)
  @HttpCode(200)
  @ApiOperation({
    description: apiEndpointDecriptionEnum.depositBisaCallback,
  })
  async depositCallback(
    @Body() depositStatusResponse: BisaDepositStatusResponseDto,
    @RequestIpAddress() ip: string,
    @Headers() headers
  ) {
    return this.bisaPaymentProviderService.depositCallback(
      depositStatusResponse,
      ip,
      headers
    );
  }

  @Post(apiPathsEnum.bisacallbackWithdraw)
  @HttpCode(200)
  @ApiOperation({
    description: apiEndpointDecriptionEnum.withdrawBisaCallback,
  })
  async withdrawCallback(
    @Body() withdrawStatusResponse: BisaWithdrawStatusResponseDto,
    @RequestIpAddress() ip: string,
    @Headers() headers
  ) {
    return this.bisaPaymentProviderService.withdrawCallback(
      withdrawStatusResponse,
      ip,
      headers
    );
  }
}
