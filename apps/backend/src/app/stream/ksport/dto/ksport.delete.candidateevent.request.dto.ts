import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';

export class BCToKSportDeleteItemDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  bcEventId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  kSportEventId: string;
}

export class KSportDeleteCandidateEventRequestDto {
  @ApiProperty({
    type: [BCToKSportDeleteItemDto],
  })
  @ValidateNested({ each: true })
  @Type(() => BCToKSportDeleteItemDto)
  candidateEvents: BCToKSportDeleteItemDto[];
}
