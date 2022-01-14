import { ApiProperty } from '@nestjs/swagger';
import { LocaleEnum } from '@workspace/enums';
import { SearchDto } from '../../../../shared/dto/Search.dto';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString, ValidateNested } from 'class-validator';


export class GetWithdrawOrderAllRequestDto extends SearchDto {
}
