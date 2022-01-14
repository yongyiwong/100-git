import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class OptionsUpdateRequestItem {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  optName: number;

  @ApiProperty()
  @IsNotEmpty()
  optValue: string | number;
}

export class OptionsUpdateRequestDto {
  @ApiProperty({
    type: [OptionsUpdateRequestItem],
  })
  @ValidateNested({ each: true })
  @Type(() => OptionsUpdateRequestItem)
  options: OptionsUpdateRequestItem[];
}
