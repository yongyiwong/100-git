import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { authenticator } from 'otplib';
import { ConfigService } from '@nestjs/config';
import { UserModel } from '../user/user.model';
import { toFileStream } from 'qrcode';
import { Response } from 'express';

@Injectable()
export class TwoFactorAuthenticationService {
  constructor(
    private userService: UserService,
    private configService: ConfigService
  ) {}

  public generateTwoFactorAuthenticationSecret() {
    const secret = authenticator.generateSecret();

    return secret;
  }

  public async generateUserTwoFactorAuthenticationSecret(user: UserModel) {
    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(
      user.email,
      this.configService.get('TWO_FACTOR_AUTHENTICATION_APP_NAME'),
      secret
    );

    return { secret, otpauthUrl };
  }

  public getQrCodeUrl(user: UserModel) {
    return authenticator.keyuri(
      user.email,
      this.configService.get('TWO_FACTOR_AUTHENTICATION_APP_NAME'),
      user.twoFactorAuthenticationSecret
    );
  }

  public async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
    return toFileStream(stream, otpauthUrl);
  }

  public isTwoFactorAuthenticationCodeValid(
    twoFactorAuthenticationCode: string,
    user: UserModel
  ) {
    return authenticator.verify({
      token: twoFactorAuthenticationCode,
      secret: user.twoFactorAuthenticationSecret,
    });
  }
}
