import { Body, Controller, Inject, Logger, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  apiEndpointDecriptionEnum,
  apiPathsEnum,
  apiTagsEnum,
} from '@workspace/enums';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { XingChenDepositStatusResponseDto } from './dto/xingchen.deposit.status.response.dto';
import { XingChenWithdrawStatusResponseDto } from './dto/xingchen.withdraw.status.response.dto';
import { XingChenPaymentProviderService } from './xingchen.payment.provider.service';
import { RequestIpAddress } from '../../../../decorators/request.ip.decorators';

@Controller(apiPathsEnum.payment)
@ApiTags(apiTagsEnum.paymentEndpoints)
export class XingChenPaymentProviderController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private xingChenPaymentProviderService: XingChenPaymentProviderService
  ) {}

  @Post(apiPathsEnum.xingchencallbackDeposit)
  @ApiOperation({
    description: apiEndpointDecriptionEnum.depositXingChenCallback,
  })
  async depositCallback(
    @Body() paymentStatusResponse: XingChenDepositStatusResponseDto,
    @RequestIpAddress() ip: string
  ): Promise<string> {
    return this.xingChenPaymentProviderService.depositCallback(
      paymentStatusResponse,
      ip
    );
  }

  @Post(apiPathsEnum.xingchencallbackWithdraw)
  @ApiOperation({
    description: apiEndpointDecriptionEnum.withdrawXingChenCallback,
  })
  async withdrawCallback(
    @Body() withdrawStatusResponse: XingChenWithdrawStatusResponseDto,
    @RequestIpAddress() ip: string
  ): Promise<string> {
    return this.xingChenPaymentProviderService.withdrawCallback(
      withdrawStatusResponse,
      ip
    );
  }
}
