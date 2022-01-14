import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthJwtStrategy } from './auth-jwt.strategy';
import { TwoFactorAuthenticationService } from './two.factor.authentication.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [UserModule, ConfigModule.forRoot({})],
  controllers: [AuthController],
  providers: [AuthService, AuthJwtStrategy, TwoFactorAuthenticationService],
})
export class AuthModule {}
