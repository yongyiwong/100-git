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
  IsNumberString,
  IsBooleanString,
  IsBoolean,
  IsNumber,
} from 'class-validator';

export class BCToKSportCreateItem {
  @ApiProperty({
    enum: SportsEnum,
  })
  @IsNotEmpty()
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

  @ApiProperty({
    default: false,
  })
  @IsNotEmpty()
  @IsBoolean()
  correct: boolean;

  @ApiPropertyOptional({
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isKilled: boolean;

  @ApiPropertyOptional({
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  streamState: boolean;

  @ApiProperty({
    default: 0,
  })
  @IsNotEmpty()
  @IsNumber()
  matchScore: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  bcTeamId1: string;

  @ApiProperty()
  @IsNotEmpty()
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

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Matches(/^[0-9]{4}-[0-2][0-9]-[0-3][0-9] [0-2][0-9]:[0-5][0-9]$/i)
  bcEventTime: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  kSportTeamId1: string;

  @ApiProperty()
  @IsNotEmpty()
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

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Matches(/^[0-9]{4}-[0-2][0-9]-[0-3][0-9] [0-2][0-9]:[0-5][0-9]$/i)
  kSportEventTime: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  kSportStreamId: string;
}

export class KSportCreateCandidateEventRequestDto {
  @ApiProperty({
    type: [BCToKSportCreateItem],
  })
  @ValidateNested({ each: true })
  @Type(() => BCToKSportCreateItem)
  candidateEvents: BCToKSportCreateItem[];
}
