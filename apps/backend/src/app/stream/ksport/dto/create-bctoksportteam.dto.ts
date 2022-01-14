import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { KSportMatchRequest } from './ksport.match.request.dto';

export class CreateBCToKSportTeamDto {
  @ApiProperty()
  @IsNotEmpty()
  betTeamId: string;

  @ApiProperty()
  @IsNotEmpty()
  betTeamName: string;

  @ApiProperty()
  @IsNotEmpty()
  KSportTeamId: string;

  @ApiProperty()
  @IsNotEmpty()
  KSportTeamName: string;

  public static matchRequestFactory(
    matchRequest: KSportMatchRequest
  ): CreateBCToKSportTeamDto {
    const item = new CreateBCToKSportTeamDto();

    item.betTeamId = matchRequest.betTeamId;
    item.betTeamName = matchRequest.betTeamName;
    item.KSportTeamId = matchRequest.KSportTeamId;
    item.KSportTeamName = matchRequest.KSportTeamName;

    return item;
  }
}
