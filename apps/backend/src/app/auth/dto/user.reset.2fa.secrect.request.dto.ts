import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class ResetUserTwoFactorAuthSecrectRequestDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
