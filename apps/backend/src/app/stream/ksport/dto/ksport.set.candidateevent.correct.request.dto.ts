import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsBooleanString,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';

export class BCToKSportSetCorrectItem {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  bcEventId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  kSportEventId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  correct: boolean;
}

export class KSportSetCandidateEventCorrectRequestDto {
  @ApiProperty({
    type: [BCToKSportSetCorrectItem],
  })
  @ValidateNested({ each: true })
  @Type(() => BCToKSportSetCorrectItem)
  candidateEvents: BCToKSportSetCorrectItem[];
}
