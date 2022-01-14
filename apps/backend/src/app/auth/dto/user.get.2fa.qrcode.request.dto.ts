import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class GetUserTwoFactorAuthQrCodeRequestDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
