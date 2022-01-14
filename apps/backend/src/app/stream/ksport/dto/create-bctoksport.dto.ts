import { ApiProperty } from '@nestjs/swagger';

import { SportsEnum } from '@workspace/enums';
import { IsNotEmpty } from 'class-validator';
import { KSportResultItemDto } from './ksport.result.item.dto';

import * as moment from 'moment-timezone';
import { BCItemDto } from './ksport.build.candidateevent.request.dto';
import { BCToKSportCreateItem } from './ksport.create.candidateevent.request.dto';

export class CreateBCToKSportDto {
  @ApiProperty()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsNotEmpty()
  sportType: SportsEnum;

  @ApiProperty()
  @IsNotEmpty()
  bcEventId: string;

  @ApiProperty()
  @IsNotEmpty()
  kSportEventId: string;

  @ApiProperty()
  @IsNotEmpty()
  matchScore: number;

  @ApiProperty()
  @IsNotEmpty()
  correct: boolean;

  @ApiProperty()
  @IsNotEmpty()
  isManual: boolean;

  @ApiProperty()
  @IsNotEmpty()
  isKilled: boolean;

  @ApiProperty()
  @IsNotEmpty()
  isStreamCn: boolean;

  @ApiProperty()
  @IsNotEmpty()
  isStreamHd: boolean;

  @ApiProperty()
  @IsNotEmpty()
  streamState: boolean;

  @ApiProperty()
  @IsNotEmpty()
  bcEventTime: Date;

  @ApiProperty()
  @IsNotEmpty()
  bcTeamId1: string;

  @ApiProperty()
  @IsNotEmpty()
  bcTeamId2: string;

  @ApiProperty()
  @IsNotEmpty()
  bcTeamName1: string;

  @ApiProperty()
  @IsNotEmpty()
  bcTeamName2: string;

  @ApiProperty()
  @IsNotEmpty()
  kSportEventTime: Date;

  @ApiProperty()
  @IsNotEmpty()
  kSportTeamId1: string;

  @ApiProperty()
  @IsNotEmpty()
  kSportTeamId2: string;

  @ApiProperty()
  @IsNotEmpty()
  kSportTeamName1: string;

  @ApiProperty()
  @IsNotEmpty()
  kSportTeamName2: string;

  @ApiProperty()
  @IsNotEmpty()
  kSportStreamId: string;

  public static createRequestFactory(
    request: BCToKSportCreateItem
  ): CreateBCToKSportDto {
    const item = new CreateBCToKSportDto();

    item.id = `${request.bcEventId}-${request.kSportEventId}`;

    item.sportType = request.sport;

    item.bcEventId = request.bcEventId;
    item.kSportEventId = request.kSportEventId;

    item.matchScore = request.matchScore;
    item.correct = request.correct;
    item.streamState = request.streamState;

    item.bcEventTime = moment
      .tz(request.bcEventTime, 'YYYY-MM-DD HH:mm', 'Asia/Shanghai')
      .toDate();
    item.kSportEventTime = moment
      .tz(request.kSportEventTime, 'YYYY-MM-DD HH:mm', 'Asia/Shanghai')
      .toDate();

    item.bcTeamId1 = request.bcTeamId1;
    item.bcTeamId2 = request.bcTeamId2;
    item.kSportTeamId1 = request.kSportTeamId1;
    item.kSportTeamId2 = request.kSportTeamId2;

    item.bcTeamName1 = request.bcTeamName1;
    item.bcTeamName2 = request.bcTeamName2;
    item.kSportTeamName1 = request.bcTeamName1;
    item.kSportTeamName2 = request.bcTeamName2;

    item.kSportStreamId = request.kSportStreamId;

    const streamIdTokens = request.kSportStreamId.match(
      /^stream(cn)?(hd)?([0-9]+)$/i
    );

    item.isStreamCn =
      streamIdTokens &&
      streamIdTokens[1] &&
      streamIdTokens[1].toUpperCase() === 'CN'
        ? true
        : false;

    item.isStreamHd =
      streamIdTokens &&
      streamIdTokens[2] &&
      streamIdTokens[2].toUpperCase() === 'HD'
        ? true
        : false;

    item.isManual = false;

    return item;
  }

  public static factory(
    sportType: SportsEnum,
    bcItem: BCItemDto,
    ksportItem: KSportResultItemDto,
    matchScore: number,
    correct: boolean
  ): CreateBCToKSportDto {
    const item = new CreateBCToKSportDto();

    item.id = `${bcItem.bcEventId}-${ksportItem.vid}`;

    item.sportType = sportType;

    item.bcEventId = bcItem.bcEventId;
    item.bcEventTime = moment
      .tz(bcItem.bcEventTime, 'YYYY-MM-DD HH:mm', 'Asia/Shanghai')
      .toDate();
    item.bcTeamId1 = bcItem.bcTeamId1;
    item.bcTeamId2 = bcItem.bcTeamId2;
    item.bcTeamName1 = bcItem.bcTeamName1;
    item.bcTeamName2 = bcItem.bcTeamName2;

    item.kSportEventId = ksportItem.vid;
    item.kSportEventTime = moment
      .unix(ksportItem.Matchtime)
      .utcOffset('+08:00')
      .toDate();
    item.kSportTeamId1 = ksportItem.Opp1ID;
    item.kSportTeamId2 = ksportItem.Opp2ID;
    item.kSportTeamName1 = ksportItem.Opp1;
    item.kSportTeamName2 = ksportItem.Opp2 === 'NULL' ? null : ksportItem.Opp2;
    item.kSportStreamId = ksportItem.StreamName;

    const streamIdTokens = item.kSportStreamId.match(
      /^stream(cn)?(hd)?([0-9]+)$/i
    );

    item.isStreamCn =
      streamIdTokens &&
      streamIdTokens[1] &&
      streamIdTokens[1].toUpperCase() === 'CN'
        ? true
        : false;

    item.isStreamHd =
      streamIdTokens &&
      streamIdTokens[2] &&
      streamIdTokens[2].toUpperCase() === 'HD'
        ? true
        : false;

    item.matchScore = matchScore;
    item.correct = correct;
    item.streamState = ksportItem.StreamInfo.state;

    item.isManual = false;

    return item;
  }
}
