import { ApiProperty } from '@nestjs/swagger';
import { LocaleEnum } from '@workspace/enums';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class KSportGetStreamStateSomeRequestDto {
  // @ApiProperty({
  //   enum: LocaleEnum,
  // })
  // @IsEnum(LocaleEnum)
  // @IsNotEmpty()
  // locale: string;

  @ApiProperty()
  bcEventIDs: string[];
}
