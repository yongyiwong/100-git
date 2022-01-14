import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Payload, ResetPassDto } from '@workspace/dto';
import { sign } from 'jsonwebtoken';
import { UserModel } from '../user/user.model';
import { UserService } from '../user/user.service';
import { TwoFactorAuthenticationService } from './two.factor.authentication.service';
const bcrypt = require('bcrypt');
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private twoFactorAuthenticationService: TwoFactorAuthenticationService
  ) {}

  async signPayload(payload: Payload) {
    return sign(payload, process.env.SECRET_KEY, { expiresIn: '12h' });
  }

  async validateUser(payload: Payload) {
    return this.userService.findByPayload(payload);
  }

  async resetPass(request: ResetPassDto, user: UserModel) {
    if (request.password.length < 6) {
      throw new HttpException(
        'Password Length should be equals than 6.',
        HttpStatus.BAD_REQUEST
      );
    }

    if (request.password !== request.confirmPassword) {
      throw new HttpException(
        'Password does not match the confirm password.',
        HttpStatus.BAD_REQUEST
      );
    }

    user.password = await bcrypt.hash(request.password, 10);

    await user.save();

    return true;
  }

  generateTwoFactorAuthenticationSecret() {
    return this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret();
  }

  async resetTwoFactorAuthSecrect(userId: string, stream: Response) {
    const user = await this.userService.findById(userId);
    if (!user) {
      return false;
    }

    const {
      secret,
      otpauthUrl,
    } = await this.twoFactorAuthenticationService.generateUserTwoFactorAuthenticationSecret(
      user
    );

    user.twoFactorAuthenticationSecret = secret;
    await user.save({});

    if (!stream) {
      return false;
    }

    await this.twoFactorAuthenticationService.pipeQrCodeStream(
      stream,
      otpauthUrl
    );
    return true;
  }

  async getTwoFactorAuthQrCode(userId: string, stream: Response) {
    const user = await this.userService.findById(userId);
    if (!user) {
      return false;
    }

    const otpauthUrl = this.twoFactorAuthenticationService.getQrCodeUrl(user);
    if (!otpauthUrl) {
      return false;
    }

    if (!stream) {
      return false;
    }

    await this.twoFactorAuthenticationService.pipeQrCodeStream(
      stream,
      otpauthUrl
    );
    return true;
  }

  async isTwoFactorAuthenticationCodeValid(
    userId: string,
    twoFactorAuthenticationCode: string
  ) {
    const user = await this.userService.findById(userId);
    if (!user) {
      return false;
    }

    return this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
      twoFactorAuthenticationCode,
      user
    );
  }
}
