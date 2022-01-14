import { ApiProperty } from '@nestjs/swagger';
import { SportsEnum } from '@workspace/enums';
import { IsNotEmpty } from 'class-validator';
import { BCToKSportModel } from '../entities/bc.ksport.entity';
import { KSportResultItemDto } from './ksport.result.item.dto';

import * as moment from 'moment-timezone';
import { BCItemDto } from './ksport.build.candidateevent.request.dto';
import { BCToKSportUpdateItem } from './ksport.update.candidateevent.request.dto';
import { BCToKSportCreateItem } from './ksport.create.candidateevent.request.dto';

export class UpdateBCToKSportDto {
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
  correct: boolean;

  @ApiProperty()
  @IsNotEmpty()
  matchScore: number;

  @ApiProperty()
  @IsNotEmpty()
  bcEventTime: string;

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
  kSportEventTime: string;

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
    item: BCToKSportModel,
    request: BCToKSportCreateItem
  ) {
    if (request.sport !== undefined) {
      item.sportType = request.sport;
    }

    if (request.matchScore !== undefined) {
      item.matchScore = request.matchScore;
    }

    if (request.correct !== undefined) {
      item.correct = request.correct;
    }

    if (request.isKilled !== undefined) {
      item.isKilled = request.isKilled;
    }

    if (request.streamState !== undefined) {
      item.streamState = request.streamState;
    }

    if (request.bcEventTime !== undefined) {
      item.bcEventTime = moment
        .tz(request.bcEventTime, 'YYYY-MM-DD HH:mm', 'Asia/Shanghai')
        .toDate();
    }

    if (request.bcTeamId1 !== undefined) {
      item.bcTeamId1 = request.bcTeamId1;
    }

    if (request.bcTeamName1 !== undefined) {
      item.bcTeamName1 = request.bcTeamName1;
    }

    if (request.bcTeamId2 !== undefined) {
      item.bcTeamId2 = request.bcTeamId2;
    }

    if (request.bcTeamName2 !== undefined) {
      item.bcTeamName2 = request.bcTeamName2;
    }

    if (request.kSportEventTime !== undefined) {
      item.kSportEventTime = moment
        .tz(request.kSportEventTime, 'YYYY-MM-DD HH:mm', 'Asia/Shanghai')
        .toDate();
    }

    if (request.kSportTeamId1 !== undefined) {
      item.kSportTeamId1 = request.kSportTeamId1;
    }

    if (request.kSportTeamName1 !== undefined) {
      item.kSportTeamName1 = request.kSportTeamName1;
    }

    if (request.kSportTeamId2 !== undefined) {
      item.kSportTeamId2 = request.kSportTeamId2;
    }

    if (request.kSportTeamName2 !== undefined) {
      item.kSportTeamName2 = request.kSportTeamName2;
    }

    if (request.kSportStreamId !== undefined) {
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
    }

    return item;
  }

  public static updateRequestFactory(
    item: BCToKSportModel,
    request: BCToKSportUpdateItem
  ): BCToKSportModel {
    if (request.sport !== undefined) {
      item.sportType = request.sport;
    }

    if (request.matchScore !== undefined) {
      item.matchScore = request.matchScore;
    }

    if (request.correct !== undefined) {
      item.correct = request.correct;
    }

    if (request.isKilled !== undefined) {
      item.isKilled = request.isKilled;
    }

    if (request.streamState !== undefined) {
      item.streamState = request.streamState;
    }

    if (request.bcEventTime !== undefined) {
      item.bcEventTime = moment
        .tz(request.bcEventTime, 'YYYY-MM-DD HH:mm', 'Asia/Shanghai')
        .toDate();
    }

    if (request.bcTeamId1 !== undefined) {
      item.bcTeamId1 = request.bcTeamId1;
    }

    if (request.bcTeamName1 !== undefined) {
      item.bcTeamName1 = request.bcTeamName1;
    }

    if (request.bcTeamId2 !== undefined) {
      item.bcTeamId2 = request.bcTeamId2;
    }

    if (request.bcTeamName2 !== undefined) {
      item.bcTeamName2 = request.bcTeamName2;
    }

    if (request.kSportEventTime !== undefined) {
      item.kSportEventTime = moment
        .tz(request.kSportEventTime, 'YYYY-MM-DD HH:mm', 'Asia/Shanghai')
        .toDate();
    }

    if (request.kSportTeamId1 !== undefined) {
      item.kSportTeamId1 = request.kSportTeamId1;
    }

    if (request.kSportTeamName1 !== undefined) {
      item.kSportTeamName1 = request.kSportTeamName1;
    }

    if (request.kSportTeamId2 !== undefined) {
      item.kSportTeamId2 = request.kSportTeamId2;
    }

    if (request.kSportTeamName2 !== undefined) {
      item.kSportTeamName2 = request.kSportTeamName2;
    }

    if (request.kSportStreamId !== undefined) {
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
    }

    return item;
  }

  public static factory(
    item: BCToKSportModel,
    sportType: SportsEnum,
    bcItem: BCItemDto,
    ksportItem: KSportResultItemDto,
    matchScore: number,
    correct?: boolean
  ): BCToKSportModel {
    item.sportType = sportType;

    item.bcEventTime = moment
      .tz(bcItem.bcEventTime, 'YYYY-MM-DD HH:mm', 'Asia/Shanghai')
      .toDate();
    item.bcTeamId1 = bcItem.bcTeamId1;
    item.bcTeamId2 = bcItem.bcTeamId2;
    item.bcTeamName1 = bcItem.bcTeamName1;
    item.bcTeamName2 = bcItem.bcTeamName2;

    item.kSportEventTime = moment
      .unix(ksportItem.Matchtime)
      .utcOffset('+08:00')
      .toDate();
    item.kSportTeamId1 = ksportItem.Opp1ID;
    item.kSportTeamId2 = ksportItem.Opp2ID;
    item.kSportTeamName1 = ksportItem.Opp1;
    item.kSportTeamName2 = ksportItem.Opp2;
    item.kSportStreamId = ksportItem.StreamName;

    const streamIdTokens = ksportItem.StreamName.match(
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
    if (correct !== undefined) item.correct = correct;
    item.streamState = ksportItem.StreamInfo.state;

    return item;
  }
}
