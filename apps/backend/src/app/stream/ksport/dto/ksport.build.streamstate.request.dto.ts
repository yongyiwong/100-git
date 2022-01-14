import { ApiProperty } from '@nestjs/swagger';
import { SportsEnum } from '@workspace/enums';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class KSportBuildStreamStateRequestDto {
  @ApiProperty({
    enum: SportsEnum,
  })
  @IsNotEmpty()
  @IsEnum(SportsEnum)
  sport: SportsEnum;
}
