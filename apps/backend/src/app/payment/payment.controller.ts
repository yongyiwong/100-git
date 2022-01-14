import {
  Controller,
  Headers,
  Post,
  Query,
  HttpException,
  HttpStatus,
  Get,
  Ip,
  Req,
  Body,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import {
  apiPathsEnum,
  apiTagsEnum,
  apiEndpointDecriptionEnum,
} from '@workspace/enums';
import { PaymentService } from './payment.service';
import { PaymentProviderDepositRequestDto } from './providers/payment-provider/payment.provider.deposit.request.dto';
import { PaymentProviderDepositResult } from './providers/payment-provider/payment.provider.deposit.result';
import { PaymentProviderWithdrawResult } from './providers/payment-provider/payment.provider.withdraw.result';
import { BetConstructWithdrawalResponse } from './betContruct/betConstruct.withdraw.response';
import { DepositableChannel } from './dto/depositable.channel';
import { WithdrawableBank } from './dto/withdrawable.banks';
import { RequestIpAddress } from '../decorators/request.ip.decorators';
import { PaymentSystemModel } from '../models/payment.system.model';
import { DepositablePaymentSystem } from './dto/depositable.paymentsystem';
import { PaymentProviderWithdrawRequestDto } from './providers/payment-provider/payment.provider.withdraw.request.dto';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PaymentManualDepositRequestDto } from './dto/payment.manual.deposit.request.dto';
import { PaymentManualDepositResultDto } from './dto/payment.manual.deposit.result.dto';
import { PaymentMakeDepositSuccessRequestDto } from './dto/payment.make.deposit.success.request.dto';
import { PaymentManualWithdrawRequestDto } from './dto/payment.manual.withdraw.request.dto';
import { PaymentManualWithdrawResultDto } from './dto/payment.manual.withdraw.result.dto';
import { PaymentMakeWithdrawSuccessRequestDto } from './dto/payment.make.withdraw.success.request.dto';
import { PaymentTestDepositRequestDto } from './dto/payment.test.deposit.request.dto';
import { PaymentTestDepositResultDto } from './dto/payment.test.deposit.result.dto';
import { PaymentDepositByCardRequestDto } from './dto/payment.deposit.bycard.request.dto';
import { PaymentDepositRequestDto } from './dto/payment.deposit.request.dto';
import { PaymentWithdrawRequestDto } from './dto/payment.withdraw.request.dto';

// class BCWithdrawRequest {
//   @ApiProperty()
//   @IsString()
//   @IsNotEmpty()
//   userId: string;

//   @ApiProperty()
//   @IsString()
//   @IsNotEmpty()
//   orderId: string;

//   @ApiProperty()
//   @IsNumber()
//   @IsNotEmpty()
//   amount: number;

//   @ApiProperty()
//   @IsString()
//   @IsNotEmpty()
//   currency: string;
// }

@Controller(apiPathsEnum.payment)
@ApiTags(apiTagsEnum.paymentEndpoints)
export class PaymentController {
  constructor(private paymentService: PaymentService) { }

  ///////////////////////////////////////////////////////////////////////////////////////
  // Deposit
  //////////////////////////////////////////////////////////////////////////////////////
  @Post(apiPathsEnum.deposit)
  @ApiOperation({ description: apiEndpointDecriptionEnum.paymentDeposit })
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  async deposit(
    @Query() depositRequestDto: PaymentDepositRequestDto,
    @RequestIpAddress() ip: string,
    @Headers() headers,
    @Req() req: Request
  ): Promise<PaymentProviderDepositResult> {
    const paymentProviderDepositRequestDto = PaymentProviderDepositRequestDto.responseFactory(
      depositRequestDto,
      ip,
      headers
    );
    return this.paymentService.deposit(paymentProviderDepositRequestDto);
  }

  ///////////////////////////////////////////////////////////////////////////////////////
  // Deposit
  //////////////////////////////////////////////////////////////////////////////////////
  @Post(apiPathsEnum.depositByCard)
  @ApiOperation({
    description: apiEndpointDecriptionEnum.paymentDepositByCard,
  })
  async getDepositInfo(@Body() requestDto: PaymentDepositByCardRequestDto) {
    return this.paymentService.depositByCard(requestDto);
  }

  @Post(apiPathsEnum.manualDeposit)
  @ApiOperation({ description: apiEndpointDecriptionEnum.paymentManualDeposit })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async manualDeposit(
    @Body() requestDto: PaymentManualDepositRequestDto,
    @RequestIpAddress() ip: string,
    @Headers() headers
  ): Promise<PaymentManualDepositResultDto> {
    return this.paymentService.manualDeposit(requestDto, ip, headers);
  }

  @Post(apiPathsEnum.testDeposit)
  @ApiOperation({ description: apiEndpointDecriptionEnum.paymentTestDeposit })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async testDeposit(
    @Body() requestDto: PaymentTestDepositRequestDto,
    @RequestIpAddress() ip: string,
    @Headers() headers
  ): Promise<PaymentTestDepositResultDto> {
    return this.paymentService.testDeposit(requestDto, ip, headers);
  }

  @Post(apiPathsEnum.depositMakeSuccess)
  @ApiOperation({
    description: apiEndpointDecriptionEnum.paymentDepositMakeSuccess,
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async depositMakeSuccess(
    @Body() requestDto: PaymentMakeDepositSuccessRequestDto
  ) {
    return this.paymentService.makeDepositSuccess(requestDto);
  }

  // @Post('getHeaders')
  // async getHeaders(
  //   @Headers() headers,
  //   @Ip() ip,
  //   @RequestIpAddress() requestIp,
  //   @Req() request
  // ) {
  //   return {
  //     headers,
  //     ip,
  //     requestIp,
  //     remoteAddress: request.connection.remoteAddress,
  //     reqIp: request.ip,
  //     token: process.env.SECRET_TOKEN,
  //   };
  // }

  ///////////////////////////////////////////////////////////////////////////////////////
  // Withdraw
  //////////////////////////////////////////////////////////////////////////////////////
  @Post(apiPathsEnum.withdraw)
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiOperation({ description: apiEndpointDecriptionEnum.paymentWithdraw })
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  async withdraw(
    @Body() withdrawRequestDto: PaymentWithdrawRequestDto,
    @RequestIpAddress() ip: string,
    @Headers()
    headers
  ): Promise<PaymentProviderWithdrawResult | Error> {
    const checkToken = PaymentWithdrawRequestDto.checkToken(
      withdrawRequestDto.token
    );
    if (!checkToken) {
      throw new HttpException('Unauthorized request', HttpStatus.FORBIDDEN);
    }

    const paymentProviderWithdrawRequestDto = PaymentProviderWithdrawRequestDto.responseFactory(
      withdrawRequestDto,
      ip,
      headers
    );

    return this.paymentService.withdraw(paymentProviderWithdrawRequestDto);
  }

  @Post(apiPathsEnum.manualWithdraw)
  @ApiOperation({
    description: apiEndpointDecriptionEnum.paymentManualWithdraw,
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async manualWithdraw(
    @Body() requestDto: PaymentManualWithdrawRequestDto,
    @RequestIpAddress() ip: string,
    @Headers() headers
  ): Promise<PaymentManualWithdrawResultDto> {
    return this.paymentService.manualWithdraw(requestDto, ip, headers);
  }

  @Post(apiPathsEnum.withdrawMakeSuccess)
  @ApiOperation({
    description: apiEndpointDecriptionEnum.paymentDepositMakeSuccess,
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async withdrawMakeSuccess(
    @Body() requestDto: PaymentMakeWithdrawSuccessRequestDto
  ) {
    return this.paymentService.makeWithdrawSuccess(requestDto);
  }

  // @Post('bcwithdraw')
  // async bcWithdraw(@Body() params: BCWithdrawRequest) {
  //   return this.paymentService.bcWithdraw(params);
  // }

  ///////////////////////////////////////////////////////////////////////////////////////
  // Get Depositable PaymentSystems
  //////////////////////////////////////////////////////////////////////////////////////
  @Get(apiPathsEnum.getDepositablePaymentSystems)
  @ApiOperation({
    description: apiEndpointDecriptionEnum.getDepositablePaymentSystems,
  })
  async getDepositablePaymentSystems(): Promise<DepositablePaymentSystem[]> {
    return this.paymentService.getDepositablePaymentSystems();
  }

  ///////////////////////////////////////////////////////////////////////////////////////
  // Get Depositable UsdtProtos
  //////////////////////////////////////////////////////////////////////////////////////
  @Get(apiPathsEnum.getDepositableUsdtProtos)
  @ApiOperation({
    description: apiEndpointDecriptionEnum.getDepositableUsdtProtos
  })
  async getDepositableUsdtProtos() {
    return this.paymentService.getDepositableUsdtProts();
  }

  // ///////////////////////////////////////////////////////////////////////////////////////
  // // Get DepositableChannels
  // //////////////////////////////////////////////////////////////////////////////////////
  // @Get(apiPathsEnum.getDepositableChannels)
  // @ApiOperation({
  //   description: apiEndpointDecriptionEnum.getDepositableChannels,
  // })
  // async getDepositableChannels(): Promise<DepositableChannel[]> {
  //   return await this.paymentService.getDepositableChannels();
  // }

  ///////////////////////////////////////////////////////////////////////////////////////
  // Get Withdrawable Banks
  //////////////////////////////////////////////////////////////////////////////////////
  @Get(apiPathsEnum.getWithdrawableBanks)
  @ApiOperation({
    description: apiEndpointDecriptionEnum.getWithdrawableBanks,
  })
  async getWithdrawableBanks() {
    return this.paymentService.getWithdrawableBanks();
  }

  ///////////////////////////////////////////////////////////////////////////////////////
  // Check Channels Depositables
  //////////////////////////////////////////////////////////////////////////////////////
  // @Post(apiPathsEnum.checkChannelsDepositable)
  // @ApiOperation({})
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // async checkChannelsDepositable() {
  //   //return this.paymentService.checkChannelsDepositable();
  // }

  ///////////////////////////////////////////////////////////////////////////////////////
  // Check Banks Withdrawable
  //////////////////////////////////////////////////////////////////////////////////////
  // @Post(apiPathsEnum.checkBanksWithdrawable)
  // @ApiOperation({})
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // async checkBanksWithdrawable() {
  //   //return this.paymentService.checkBanksWithdrawable();
  // }
}
