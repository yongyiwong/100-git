import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class KSportDeleteCandidateEventByTimeRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Matches(/^[0-9]{4}-[0-2][0-9]-[0-3][0-9] [0-2][0-9]:[0-5][0-9]:[0-5][0-9]$/i)
  untilTime: string;
}
