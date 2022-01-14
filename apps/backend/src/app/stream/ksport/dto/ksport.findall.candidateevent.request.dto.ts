import { ApiPropertyOptional } from '@nestjs/swagger';
import { SportsEnum } from '@workspace/enums';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsBooleanString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class KSportFindAllCandidateEventRequestDto {
  @ApiPropertyOptional({
    type: 'number',
    default: 10,
  })
  @IsOptional()
  @IsInt()
  @Transform((params) => Number(params.value))
  pageSize: number;

  @ApiPropertyOptional({
    type: 'number',
    default: 1,
  })
  @IsOptional()
  @IsInt()
  @Transform((params) => Number(params.value))
  page: number;

  @ApiPropertyOptional({
    enum: SportsEnum,
  })
  @IsOptional()
  @IsEnum(SportsEnum)
  sport: SportsEnum;

  @ApiPropertyOptional({
    type: 'string',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  bcEventId: string;

  @ApiPropertyOptional({
    type: 'string',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  kSportEventId: string;

  @ApiPropertyOptional({
    type: 'string',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  bcTeamNameLike: string;

  @ApiPropertyOptional({
    type: 'boolean',
  })
  @IsOptional()
  @IsBoolean()
  @Transform((params) => /true/i.test(params.value))
  correct: boolean;

  @ApiPropertyOptional({
    type: 'number',
  })
  @IsOptional()
  @IsNumber()
  @Transform((params) => Number(params.value))
  lessThanMatchScore: number;

  @ApiPropertyOptional({
    type: 'number',
  })
  @IsOptional()
  @IsNumber()
  @Transform((value) => Number(value))
  greaterThanMatchScore: number;
}
