import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { SportsEnum } from '@workspace/enums';

export class KSportFindCandidateTeamRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(SportsEnum)
  sport: SportsEnum;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  team: string;
}
