import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDecimal,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class OrderLatest {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  date: string;

  @ApiProperty()
  @Transform((params) => Number(params.value))
  @IsInt()
  @IsNotEmpty()
  nums: number;
}

export class NotifyGetRequestDto {
  @ApiProperty({
    type: OrderLatest,
  })
  @ValidateNested({ each: true })
  @Type(() => OrderLatest)
  //@IsNotEmpty()
  depositOrderLatest: OrderLatest;

  @ApiProperty({
    type: OrderLatest,
  })
  @ValidateNested({ each: true })
  @Type(() => OrderLatest)
  //@IsNotEmpty()
  withdrawOrderLatest: OrderLatest;
}
