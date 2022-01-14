import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { BCToKSportTeamModel } from '../entities/bc.ksport.team.entity';
import { KSportMatchRequest } from './ksport.match.request.dto';

export class UpdateBCToKSportTeamDto {
  @ApiProperty()
  @IsNotEmpty()
  id: string;

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
    item: BCToKSportTeamModel,
    matchRequest: KSportMatchRequest
  ): BCToKSportTeamModel {
    item.kSportTeamId = matchRequest.betTeamId;
    item.bcTeamName = matchRequest.betTeamName;
    item.kSportTeamId = matchRequest.KSportTeamId;
    item.kSportTeamName = matchRequest.KSportTeamName;

    return item;
  }
}
