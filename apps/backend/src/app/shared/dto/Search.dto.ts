import { ApiProperty } from '@nestjs/swagger';
import { LocaleEnum } from '@workspace/enums';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString, IsInt, ValidateNested } from 'class-validator';
import { SortDirectionEnum } from '../enums/SortDirectionEnum';

export class SortItem {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  property: string;

  @ApiProperty({
    enum: SortDirectionEnum,
  })
  @IsEnum(SortDirectionEnum)
  @IsNotEmpty()
  direction: string;
}

export type FilterItemValue = string | number

export class FilterItem {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  key: string;

  @ApiProperty()
  @IsNotEmpty()
  value: FilterItemValue;
}

export class SearchDto {
  @ApiProperty({})
  @IsInt()
  page: number;

  @ApiProperty({})
  @IsInt()
  pageSize: number;

  @ApiProperty({
    type: [FilterItem],
  })
  @ValidateNested({ each: true })
  @Type(() => FilterItem)
  filters: FilterItem[];

  @ApiProperty({
    type: [SortItem],
  })
  @ValidateNested({ each: true })
  @Type(() => SortItem)
  sorts: SortItem[];
}
