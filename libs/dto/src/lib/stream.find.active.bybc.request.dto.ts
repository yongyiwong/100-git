import { ApiProperty } from '@nestjs/swagger';
import { LocaleEnum } from '@workspace/enums';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class StreamFindActiveByBCRequestDto {
  @ApiProperty({
    enum: LocaleEnum,
  })
  @IsEnum(LocaleEnum)
  @IsNotEmpty()
  locale: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  bcEventId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  session_id: string;
}
