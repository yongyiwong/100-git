import { ApiProperty } from '@nestjs/swagger';
import { SportsEnum } from '@workspace/enums';
import { IsNotEmpty, IsString, Matches, IsEnum } from 'class-validator';

export class StreamFindActiveRequestDto {
    @ApiProperty({
        enum: SportsEnum
    })
    @IsNotEmpty()
    @IsEnum(SportsEnum)
    sport: SportsEnum;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    team1: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    team2: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    //@Matches(/^[01][0-9]-[0-3][0-9] [0-2][0-9]:[0-5][0-9]$/i)
    @Matches(/^[0-9]{4}-[0-2][0-9]-[0-3][0-9] [0-2][0-9]:[0-5][0-9]$/i)
    time: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    session_id: string;
}
