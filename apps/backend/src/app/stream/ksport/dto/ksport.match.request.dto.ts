import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class KSportMatchRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  betTeamName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  betTeamId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  KSportTeamName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  KSportTeamId: string;
}
