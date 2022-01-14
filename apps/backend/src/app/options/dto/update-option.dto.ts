import { ApiProperty } from '@nestjs/swagger';
import { OptionsModel } from '../../models/options.model';
import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';
import { OptionsUpdateRequestItem } from './options.update.request.dto';

export class UpdateOptionDto {
  @ApiProperty()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isActive: boolean;

  public static updateRequestFactory(
    item: OptionsModel,
    requestItem: OptionsUpdateRequestItem
  ): OptionsModel {
    if (requestItem.optValue !== undefined) {
      item.optValue = Buffer.from(`${requestItem.optValue}`);
    }

    return item;
  }
}
