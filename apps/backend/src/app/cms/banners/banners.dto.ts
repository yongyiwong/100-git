import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class BannerFileDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  image: any;
}

export class BannersGetDto {
  @ApiProperty()
  image: string
}



export class CreateBannerDto {

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  type: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  banner: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string

  @ApiPropertyOptional()
  @IsOptional()
  order: number

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  buttonText: string

  @ApiPropertyOptional()
  @IsOptional()
  buttonColor: string

  @ApiPropertyOptional()
  @IsOptional()
  positionX: number

  @ApiPropertyOptional()
  @IsOptional()
  positionY: number

  @ApiProperty()
  @IsNotEmpty()
  enabled: boolean
}

export class CreateBannerFileDto extends CreateBannerDto {

  @ApiProperty({ type: 'string', format: 'binary' })
  image: any;
}
