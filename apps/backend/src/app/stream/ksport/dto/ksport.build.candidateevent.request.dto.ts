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
} from 'class-validator';

export class BCItemDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  bcEventId: string;

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
}

export class KSportBuildCandidateEventRequestDto {
  @ApiProperty({
    enum: SportsEnum,
  })
  @IsNotEmpty()
  @IsEnum(SportsEnum)
  sport: string;

  @ApiProperty({
    type: [BCItemDto],
  })
  @ValidateNested({ each: true })
  @Type(() => BCItemDto)
  bcItems: BCItemDto[];
}
