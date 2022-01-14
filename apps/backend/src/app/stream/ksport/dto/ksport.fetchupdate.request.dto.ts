import { ApiProperty } from '@nestjs/swagger';
import { SportsEnum } from '@workspace/enums';
import { IsNotEmpty, IsEnum, IsBoolean } from 'class-validator';

export class KSportFetchUpdateRequestDto {
  @ApiProperty({
    default: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  force: boolean;
}
