import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Put,
  Query,
  UseGuards,
  Request,
  Res,
  Header,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto, Payload, ResetPassDto, UserTokenDto } from '@workspace/dto';
import {
  apiEndpointDecriptionEnum,
  apiPathsEnum,
  apiTagsEnum,
} from '@workspace/enums';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ResetUserTwoFactorAuthSecrectRequestDto } from './dto/user.reset.2fa.secrect.request.dto';
import * as numeral from 'numeral';
import { GetUserTwoFactorAuthQrCodeRequestDto } from './dto/user.get.2fa.qrcode.request.dto';

@Controller(apiPathsEnum.auth)
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  @Post(apiPathsEnum.login)
  @ApiOperation({ description: apiEndpointDecriptionEnum.userLogin })
  @ApiTags(apiTagsEnum.authentication)
  async login(@Body() loginDto: LoginDto) {
    const user = await this.userService.findByLogin(loginDto);

    const result = await this.authService.isTwoFactorAuthenticationCodeValid(
      user.id,
      loginDto.twoFactorAuthenticationCode
    );

    if (!result) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const payload: Payload = {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
    const token = await this.authService.signPayload(payload);
    return { token };
  }

  @Post(apiPathsEnum.create)
  @ApiOperation({ description: apiEndpointDecriptionEnum.userCreate })
  @ApiTags(apiTagsEnum.authentication)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async create(@Query() userDto: UserTokenDto) {
    console.log(userDto.token);
    console.log(process.env.SECRET_TOKEN);
    const checkToken = UserTokenDto.checkToken(userDto.token);
    if (checkToken) {
      const sanitizeToken = this.userService.sanitizeToken(
        userDto,
        this.authService.generateTwoFactorAuthenticationSecret()
      );

      const user = await this.userService.create(sanitizeToken);
      const payload: Payload = {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      };
      const token = await this.authService.signPayload(payload);
      return { token };
    }
    return new HttpException('Unauthorized request', HttpStatus.FORBIDDEN);
  }

  @Put(apiPathsEnum.reset)
  @ApiOperation({ description: apiEndpointDecriptionEnum.userResetPass })
  @ApiTags(apiTagsEnum.authentication)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async reset(@Body() request: ResetPassDto, @Request() req) {
    return this.authService.resetPass(request, req.user);
  }

  @Post(apiPathsEnum.resetTwoFactorAuthSecret)
  @ApiOperation({
    description: apiEndpointDecriptionEnum.userResetTwoFactorAuthSecret,
  })
  @ApiTags(apiTagsEnum.authentication)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Header('content-type', 'image/png')
  async resetTwoFactorAuthSecret(
    @Body() request: ResetUserTwoFactorAuthSecrectRequestDto,
    @Res() response: Response
  ) {
    const result = this.authService.resetTwoFactorAuthSecrect(
      request.userId,
      response
    );
    if (!result) {
      response.status(HttpStatus.OK).send();
    }
  }

  @Post(apiPathsEnum.getTwoFactorAuthQrCode)
  @ApiOperation({
    description: apiEndpointDecriptionEnum.userGetTwoFactorAuthQrCode,
  })
  @ApiTags(apiTagsEnum.authentication)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Header('content-type', 'image/png')
  async getTwoFactorAuthQrCode(
    @Body() request: GetUserTwoFactorAuthQrCodeRequestDto,
    @Res() response: Response
  ) {
    const result = await this.authService.getTwoFactorAuthQrCode(
      request.userId,
      response
    );

    if (!result) {
      response.status(HttpStatus.OK).send();
    }
  }
}
