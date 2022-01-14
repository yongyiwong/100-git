import { Body, Controller, Inject, Logger, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  apiPathsEnum,
  apiTagsEnum,
  apiEndpointDecriptionEnum,
} from '@workspace/enums';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { MSZFDepositStatusResponseDto } from './dto/mszf.deposit.status.response.dto';
import { MSZFWithdrawStatusResponseDto } from './dto/mszf.withdraw.status.response.dto';
import { MSZFPaymentProviderService } from './mszf.payment.provider.service';
import { RequestIpAddress } from '../../../../decorators/request.ip.decorators';

@Controller(apiPathsEnum.payment)
@ApiTags(apiTagsEnum.paymentEndpoints)
export class MSZFPaymentCallbackController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private mszfPaymentProviderService: MSZFPaymentProviderService
  ) {}

  @Post(apiPathsEnum.mszfcallbackDeposit)
  @ApiOperation({
    description: apiEndpointDecriptionEnum.depositMSZFCallback,
  })
  async depositCallBack(
    @Body() mszfPaymentStatusResponseDto: MSZFDepositStatusResponseDto,
    @RequestIpAddress() ip: string
  ): Promise<string> {
    this.logger.debug('Despoit callback parameters are ');
    this.logger.debug(JSON.stringify(mszfPaymentStatusResponseDto));
    return this.mszfPaymentProviderService.depositCallback(
      mszfPaymentStatusResponseDto,
      ip
    );
  }
  @Post(apiPathsEnum.mszfcallbackWithdraw)
  @ApiOperation({
    description: apiEndpointDecriptionEnum.withdrawMSZFCallback,
  })
  async withdrawCallBack(
    @Body() mszfPaymentStatusResponseDto: MSZFWithdrawStatusResponseDto,
    @RequestIpAddress() ip: string
  ): Promise<string> {
    this.logger.debug('Withdrawal callback parameters are ');
    this.logger.debug(JSON.stringify(mszfPaymentStatusResponseDto));
    return this.mszfPaymentProviderService.withdrawCallback(
      mszfPaymentStatusResponseDto,
      ip
    );
  }
}
