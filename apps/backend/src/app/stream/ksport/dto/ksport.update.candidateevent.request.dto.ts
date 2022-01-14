import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SportsEnum } from '@workspace/enums';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  Matches,
  IsEnum,
  ValidateNested,
  IsOptional,
  IsNumber,
  IsBoolean,
} from 'class-validator';

export class BCToKSportUpdateItem {
  @ApiPropertyOptional({
    enum: SportsEnum,
  })
  @IsOptional()
  @IsEnum(SportsEnum)
  sport: SportsEnum;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  bcEventId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  kSportEventId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  correct: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isKilled: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  streamState: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  matchScore: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bcTeamId1: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bcTeamName1: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bcTeamId2: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bcTeamName2: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Matches(/^[0-9]{4}-[0-2][0-9]-[0-3][0-9] [0-2][0-9]:[0-5][0-9]$/i)
  bcEventTime: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  kSportTeamId1: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  kSportTeamName1: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  kSportTeamId2: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  kSportTeamName2: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Matches(/^[0-9]{4}-[0-2][0-9]-[0-3][0-9] [0-2][0-9]:[0-5][0-9]$/i)
  kSportEventTime: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  kSportStreamId: string;
}

export class KSportUpdateCandidateEventRequestDto {
  @ApiProperty({
    type: [BCToKSportUpdateItem],
  })
  @ValidateNested({ each: true })
  @Type(() => BCToKSportUpdateItem)
  candidateEvents: BCToKSportUpdateItem[];
}
