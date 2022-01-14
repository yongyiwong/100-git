import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { KSportResultItemDto } from './dto/ksport.result.item.dto';
import * as Locale from '../../locale';

import Fuse from 'fuse.js';
import * as moment from 'moment-timezone';

import { InjectModel } from '@nestjs/sequelize';
import { BCToKSportTeamModel } from './entities/bc.ksport.team.entity';
import { CreateBCToKSportTeamDto } from './dto/create-bctoksportteam.dto';
import { UpdateBCToKSportTeamDto } from './dto/update-bctokposrtteam.dto';
import { LocaleEnum, SportsEnum } from '@workspace/enums';
import { FindMatchKSportEventOptions } from './options/find.match.ksport.event.options';
import { CreateBCToKSportDto } from './dto/create-bctoksport.dto';
import { BCToKSportModel } from './entities/bc.ksport.entity';
import { UpdateBCToKSportDto } from './dto/update-bctoksport.dto';
import { FindOptions, Op } from 'sequelize';

import { KSportFindAllCandidateEventRequestDto } from './dto/ksport.findall.candidateevent.request.dto';
import { KSportFindAllCandidateEventResponseDto } from './dto/ksport.findall.candidateevent.response.dto';

import {
  KSportBuildCandidateEventRequestDto,
  BCItemDto,
} from './dto/ksport.build.candidateevent.request.dto';
import {
  KSportBuildCandidateEventResponseDto,
  BcItemResponse,
  KSportItemResponse,
} from './dto/ksport.build.candidateevent.response.dto';
import { KSportCreateCandidateEventRequestDto } from './dto/ksport.create.candidateevent.request.dto';
import { KSportCreateCandidateEventResponseDto } from './dto/ksport.create.candidateevent.response.dto';
import { KSportDeleteCandidateEventRequestDto } from './dto/ksport.delete.candidateevent.request.dto';
import { KSportDeleteCandidateEventResponseDto } from './dto/ksport.delete.candidateevent.response.dto';
import { KSportFindCandidateTeamRequest } from './dto/ksport.find.candidateteam.request.dto';
import {
  KSportFindCandidateTeamResponse,
  KSportCandidate,
} from './dto/ksport.find.candidateteam.response.dto';
import { KSportMatchRequest } from './dto/ksport.match.request.dto';
import { KSportMatchResponse } from './dto/ksport.match.response.dto';
import { KSportSetCandidateEventCorrectRequestDto } from './dto/ksport.set.candidateevent.correct.request.dto';
import { KSportSetCandidateEventCorrectResponseDto } from './dto/ksport.set.candidateevent.correct.response.dto';
import { KSportUpdateCandidateEventRequestDto } from './dto/ksport.update.candidateevent.request.dto';
import { KSportUpdateCandidateEventResponseDto } from './dto/ksport.update.candidateevent.response.dto';
import { StreamFindActiveRequestDto } from '@workspace/dto';
import { KSportBuildStreamStateRequestDto } from './dto/ksport.build.streamstate.request.dto';
import { KSportBuildStreamStateResponseDto } from './dto/ksport.build.streamstate.response.dto';
import { KSportBuildStreamStateSomeRequestDto } from './dto/ksport.build.streamstate.some.request.dto';
import { KSportBuildStreamStateSomeResponseDto } from './dto/ksport.build.streamstate.some.response.dto';
import { KSportFetchService } from './ksport.fetch.service';
import { KSportGetStreamStateSomeRequestDto } from './dto/ksport.get.streamstate.some.request.dto';
import { KSportGetStreamStateSomeResponseDto } from './dto/ksport.get.streamstate.some.response.dto';

import { Sequelize } from 'sequelize-typescript';
import { KSportDeleteCandidateEventByTimeRequestDto } from './dto/ksport.delete.candidateevent.bytime.request.dto';
import { KSportDeleteCandidateEventByTimeResponseDto } from './dto/ksport.delete.candidateevent.bytime.response.dto';
import { TestModel } from '../../models/test.entity';

@Injectable()
export class KSportService {
  kSportFileName: string;
  isNewFileWrited: boolean;
  kSportResultsFromLocal: KSportResultItemDto[][];
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
    private kSportFetchService: KSportFetchService,

    @InjectModel(BCToKSportModel)
    private bcToKSportRepository: typeof BCToKSportModel,

    @InjectModel(BCToKSportTeamModel)
    private bcToKSportTeamRepository: typeof BCToKSportTeamModel,

    @InjectModel(TestModel)
    private testRepository: typeof TestModel,

    private sequelize: Sequelize
  ) {}

  ////////////////////////////////////////////////////////////////////////////////
  // Find By BetConstruct
  ///////////////////////////////////////////////////////////////////////////////
  async findByBC(
    streamFindActiveRequest: StreamFindActiveRequestDto
  ): Promise<KSportResultItemDto> {
    const openInfo = await this.kSportFetchService.openData(
      streamFindActiveRequest.sport
    );

    if (!openInfo) {
      return null;
    }

    const { fetchData } = openInfo;

    const matchedItem = this.findMatchKSportItemByBC(
      streamFindActiveRequest,
      fetchData
    );

    return matchedItem;
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Get Stream State By BC Items
  ///////////////////////////////////////////////////////////////////////////////
  async getStreamStateSome(
    request: KSportGetStreamStateSomeRequestDto
  ): Promise<KSportGetStreamStateSomeResponseDto> {
    const response = new KSportGetStreamStateSomeResponseDto();
    response.result = false;
    response.data = {};

    const bcEventIDs = request.bcEventIDs;
    if (bcEventIDs.length < 1) {
      return response;
    }

    //const localeId: number = LocaleEnum[request.locale];

    const bcToKSportItems = await this.bcToKSportRepository.findAll({
      attributes: [
        [
          Sequelize.literal('distinct on("bcEventId") "bcEventId"'),
          'bcEventId',
        ],
        'streamState',
        'isManual',
        'correct',
        'matchScore',
      ],
      where: {
        bcEventId: {
          [Op.in]: bcEventIDs,
        },
        //correct: true,
      },
      order: [
        ['bcEventId', 'ASC'],
        ['isManual', 'DESC'],
        ['correct', 'DESC'],
        ['matchScore', 'ASC'],
        ['isKilled', 'ASC'],
        ['streamState', 'DESC'],
        // ['isStreamCn', localeId === LocaleEnum.cn ? 'DESC' : 'ASC'],
        // ['isStreamHd', 'DESC'],
      ],
    });

    if (!bcToKSportItems) {
      return response;
    }

    bcToKSportItems.forEach((bcToKSportItem) => {
      const data = response.data;
      const bcEventId = bcToKSportItem.bcEventId;

      if (data[bcEventId]) {
        return;
      }

      data[bcEventId] = {
        streamState: bcToKSportItem.streamState,
        isManual: bcToKSportItem.isManual,
        correct: bcToKSportItem.correct,
        matchScore: bcToKSportItem.matchScore,
      };
    });

    response.result = true;
    return response;
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Build Stream State
  ///////////////////////////////////////////////////////////////////////////////
  async buildStreamState(
    request: KSportBuildStreamStateRequestDto
  ): Promise<KSportBuildStreamStateResponseDto> {
    const response = new KSportBuildStreamStateResponseDto();
    response.result = false;
    response.numKSportResults = 0;
    response.numKSportResultsApplied = 0;

    const openInfo = await this.kSportFetchService.openData(request.sport);

    if (!openInfo) {
      response.result = true;
      return response;
    }

    const { fetchData } = openInfo;

    response.numKSportResults = fetchData.length;

    let numKSportsResultsApplied = 0;

    for (let i = 0; i < fetchData.length; i++) {
      const kSportResultItem = fetchData[i];

      const bcToKSports = await this.bcToKSportRepository.findAll({
        where: {
          kSportEventId: kSportResultItem.vid,
          //correct: true,
          // [Op.and]: {
          //   isManual: false,
          //   correct: false
          // }
        },
      });

      if (!bcToKSports || bcToKSports.length < 1) {
        continue;
      }

      await this.buildStreamStateEntities(kSportResultItem, bcToKSports, true);
      numKSportsResultsApplied++;
    }

    //this.kSportFetchService.closeData(fetchHandle);

    response.numKSportResultsApplied = numKSportsResultsApplied;
    response.result = true;

    return response;
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Build Stream State Some
  ///////////////////////////////////////////////////////////////////////////////
  async buildStreamStateSome(
    request: KSportBuildStreamStateSomeRequestDto
  ): Promise<KSportBuildStreamStateSomeResponseDto> {
    const response = new KSportBuildStreamStateSomeResponseDto();
    response.result = false;

    const bcEventIDs = request.bcEventIDs;
    if (bcEventIDs.length < 1) {
      return response;
    }

    const bcToKSprotItems = await this.bcToKSportRepository.findAll({
      where: {
        bcEventId: {
          [Op.in]: bcEventIDs,
        },
        //correct: true,
      },
    });

    for (let i = 0; i < bcToKSprotItems.length; i++) {
      const bcToKSportItem = bcToKSprotItems[i];

      const kSportEventId = bcToKSportItem.kSportEventId;

      const kSportResultItem = await this.fetchKSportResultById(kSportEventId);

      if (!kSportResultItem) {
        continue;
      }

      await this.buildStreamStateEntities(
        kSportResultItem,
        [bcToKSportItem],
        true
      );
    }

    response.result = true;
    return response;
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Find All Candidate Events
  ///////////////////////////////////////////////////////////////////////////////
  async findAllCandidateEvent(
    query: KSportFindAllCandidateEventRequestDto
  ): Promise<KSportFindAllCandidateEventResponseDto> {
    const findOptions: FindOptions = {},
      where: {} = {};

    if (query.sport) {
      where['sportType'] = query.sport;
    }

    if (query.bcTeamNameLike) {
      where[Op.or] = [
        { bcTeamName1: { [Op.like]: `%${query.bcTeamNameLike}%` } },
        { bcTeamName2: { [Op.like]: `%${query.bcTeamNameLike}%` } },
      ];
    }

    if (query.bcEventId) {
      where['bcEventId'] = query.bcEventId;
    }

    if (query.kSportEventId) {
      where['kSportEventId'] = query.kSportEventId;
    }

    if (query.correct !== undefined) {
      where['correct'] = query.correct;
    }

    if (
      query.lessThanMatchScore !== undefined ||
      query.greaterThanMatchScore !== undefined
    ) {
      where['matchScore'] = {};

      if (query.lessThanMatchScore !== undefined) {
        where['matchScore'][Op.lt] = query.lessThanMatchScore;
      }
      if (query.greaterThanMatchScore !== undefined) {
        where['matchScore'][Op.gt] = query.greaterThanMatchScore;
      }
    }

    findOptions.where = where;

    if (query.page === undefined) query.page = 0;
    if (query.pageSize === undefined) query.pageSize = 10;

    if (query.pageSize > 0) {
      findOptions.offset = query.pageSize * Math.max(query.page - 1, 0);
      findOptions.limit = query.pageSize;
    }

    findOptions.order = [
      ['sportType', 'ASC'],
      ['bcEventTime', 'ASC'],
      //['kSportEventTime', 'ASC'],
      ['bcEventId', 'ASC'],
      //['kSportEventId', 'ASC'],
      ['matchScore', 'ASC'],
    ];

    const { count, rows } = await this.bcToKSportRepository.findAndCountAll(
      findOptions
    );

    const response = new KSportFindAllCandidateEventResponseDto();
    response.total = count;
    response.items = rows;

    return response;
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Build Candidate Event By BetConstruct
  ///////////////////////////////////////////////////////////////////////////////
  async buildCandidateEventByBC(
    candidateEventRequest: KSportBuildCandidateEventRequestDto
  ): Promise<KSportBuildCandidateEventResponseDto> {
    const canddiateEventResponse = new KSportBuildCandidateEventResponseDto();
    canddiateEventResponse.result = false;
    canddiateEventResponse.bcItems = [];

    const openInfo = await this.kSportFetchService.openData(
      SportsEnum[candidateEventRequest.sport]
    );

    if (!openInfo) {
      canddiateEventResponse.result = true;
      return canddiateEventResponse;
    }

    const { fetchData } = openInfo;

    for (let i = 0; i < candidateEventRequest.bcItems.length; i++) {
      const bcItem = candidateEventRequest.bcItems[i];

      const bcItemResponse = new BcItemResponse();
      bcItemResponse.bcEventId = bcItem.bcEventId;
      bcItemResponse.kSportItems = [];

      const findOptions = new FindMatchKSportEventOptions();
      findOptions.bcTeam1 = bcItem.bcTeamName1;
      findOptions.bcTeam2 = bcItem.bcTeamName2;
      findOptions.bcEventTime = bcItem.bcEventTime;

      const matchsKSItems = this.findMatchKSportItemsByBC(
        fetchData,
        findOptions
      );

      if (!matchsKSItems || matchsKSItems.length < 1) {
        //console.log(bcItem);
      }

      const candidateEntities = await this.buildCandidateEventEntity(
        SportsEnum[candidateEventRequest.sport],
        bcItem,
        matchsKSItems,
        true
      );

      candidateEntities.forEach((item) => {
        const kSportItemResponse = new KSportItemResponse();
        kSportItemResponse.kSportEventId = item.kSportEventId;

        bcItemResponse.kSportItems.push(kSportItemResponse);
      });

      canddiateEventResponse.bcItems.push(bcItemResponse);
    }

    canddiateEventResponse.result = true;
    return canddiateEventResponse;
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Create Candidate Event
  ///////////////////////////////////////////////////////////////////////////////
  async createCandidateEvent(
    createCandidateEventRequest: KSportCreateCandidateEventRequestDto
  ): Promise<KSportCreateCandidateEventResponseDto> {
    const response = new KSportCreateCandidateEventResponseDto();
    response.result = false;
    for (
      let i = 0;
      i < createCandidateEventRequest.candidateEvents.length;
      i++
    ) {
      const requestItem = createCandidateEventRequest.candidateEvents[i];

      const itemAlready = await this.bcToKSportRepository.findOne({
        where: {
          bcEventId: requestItem.bcEventId,
          kSportEventId: requestItem.kSportEventId,
        },
      });
      const itemLikeBC = await this.bcToKSportRepository.findOne({
        where: {
          bcEventId: requestItem.bcEventId,
        },
      });

      let itemResult: BCToKSportModel = null;

      if (itemAlready) {
        //response.message = Locale.MSG_KSPORT_EXIST_CANDIDATE;
        itemResult = UpdateBCToKSportDto.createRequestFactory(
          itemAlready,
          requestItem
        );

        if (itemLikeBC) {
          this.syncItemBcEvent(itemResult, itemLikeBC);
        }

        await itemResult.save();
      } else {
        const createBCToKSport = CreateBCToKSportDto.createRequestFactory(
          requestItem
        );
        createBCToKSport.isManual = true;
        if (itemLikeBC) {
          this.syncCreateBcToKSportByBcEvent(createBCToKSport, itemLikeBC);
        }

        itemResult = await this.bcToKSportRepository.create(createBCToKSport);
      }

      /* if (!item) {
                response.message =
                    Locale.MSG_KSPORT_CREATE_CANDIDATE_EVENT_ERROR;
            } */
    }

    response.result = true;
    return response;
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Update Candidate Event
  ///////////////////////////////////////////////////////////////////////////////
  async updateCandidateEvent(
    updateCandidateEventRequest: KSportUpdateCandidateEventRequestDto
  ): Promise<KSportUpdateCandidateEventResponseDto> {
    const response = new KSportUpdateCandidateEventResponseDto();
    response.result = false;

    for (
      let i = 0;
      i < updateCandidateEventRequest.candidateEvents.length;
      i++
    ) {
      const requestItem = updateCandidateEventRequest.candidateEvents[i];

      const item = await this.bcToKSportRepository.findOne({
        where: {
          bcEventId: requestItem.bcEventId,
          kSportEventId: requestItem.kSportEventId,
        },
      });

      if (!item) {
        continue;
      }

      const itemUpdated = UpdateBCToKSportDto.updateRequestFactory(
        item,
        requestItem
      );

      this.syncOtherBcEvent(itemUpdated);

      await itemUpdated.save();
    }

    response.result = true;
    return response;
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Delete Candidate Event
  ///////////////////////////////////////////////////////////////////////////////
  async deleteCandidateEvent(
    deleteCandidateEventRequest: KSportDeleteCandidateEventRequestDto
  ): Promise<KSportDeleteCandidateEventResponseDto> {
    const response = new KSportDeleteCandidateEventResponseDto();
    response.result = false;

    const bcToKSportItems = deleteCandidateEventRequest.candidateEvents;

    for (let i = 0; i < bcToKSportItems.length; i++) {
      const bcToKSportItem = bcToKSportItems[i];

      const bcToKSport = await this.bcToKSportRepository.findOne({
        where: {
          bcEventId: bcToKSportItem.bcEventId,
          kSportEventId: bcToKSportItem.kSportEventId,
        },
      });

      if (!bcToKSport) {
        continue;
      }

      await bcToKSport.destroy();
    }

    response.result = true;
    return response;
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Delete Candidate Event By Time
  ///////////////////////////////////////////////////////////////////////////////
  async deleteCandidateEventByTime(
    deleteCandidateEventByTimeRequest: KSportDeleteCandidateEventByTimeRequestDto
  ): Promise<KSportDeleteCandidateEventByTimeResponseDto> {
    const response = new KSportDeleteCandidateEventByTimeResponseDto();
    response.result = false;

    const untilTime = moment.tz(
      deleteCandidateEventByTimeRequest.untilTime,
      'YYYY-MM-DD HH:mm:ss',
      'Asia/Shanghai'
    );

    await this.bcToKSportRepository.destroy({
      where: {
        [Op.or]: [
          { bcEventTime: { [Op.lt]: untilTime } },
          { kSportEventTime: { [Op.lt]: untilTime } },
        ],
      },
    });

    response.result = true;
    return response;
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Set Candidate Event Correct
  ///////////////////////////////////////////////////////////////////////////////
  async setCandidateEventCorrect(
    request: KSportSetCandidateEventCorrectRequestDto
  ): Promise<KSportSetCandidateEventCorrectResponseDto> {
    const response = new KSportSetCandidateEventCorrectResponseDto();
    response.result = false;
    for (let i = 0; i < request.candidateEvents.length; i++) {
      const requestItem = request.candidateEvents[i];

      const candidateEntity = await this.bcToKSportRepository.findOne({
        where: {
          bcEventId: requestItem.bcEventId,
          kSportEventId: requestItem.kSportEventId,
        },
      });

      if (!candidateEntity) {
        response.message = Locale.MSG_KSPORT_NO_MATCHED_EVENT_ERROR;
        return response;
      }
      candidateEntity.correct = requestItem.correct;
      await candidateEntity.save();
    }

    response.result = true;
    return response;
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Find KSport Candidate By BetConstruct Team Name
  ///////////////////////////////////////////////////////////////////////////////
  async findCandidateTeamByBC(
    candidateRequest: KSportFindCandidateTeamRequest
  ): Promise<KSportFindCandidateTeamResponse> {
    const result = new KSportFindCandidateTeamResponse();
    result.result = false;

    const openInfo = await this.kSportFetchService.openData(
      candidateRequest.sport
    );

    if (!openInfo) {
      result.message = Locale.MSG_KSPORT_FETCH_ERROR;
      return null;
    }

    const { fetchData } = openInfo;

    const ksportFuseItems = this.findMatchCandidateTeamByBC(
      candidateRequest,
      fetchData
    );

    const candidateItems: KSportCandidate[] = [];
    const tmpTeamIds = [];
    for (let i = 0; i < ksportFuseItems.length; i++) {
      const ksportFuseItem = ksportFuseItems[i];
      const candidateItem = this.factoryKSportCandidateFromFuseKSportResultItem(
        ksportFuseItem
      );

      if (!candidateItem) {
        continue;
      }

      if (tmpTeamIds.find((teamId) => teamId === candidateItem.teamId)) {
        continue;
      }

      tmpTeamIds.push(candidateItem.teamId);

      candidateItems.push(candidateItem);
    }

    result.items = candidateItems;
    result.result = true;

    return result;
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Find KSport Team By BetConstruct Team
  ///////////////////////////////////////////////////////////////////////////////
  async setMatchTeamByBC(
    matchRequest: KSportMatchRequest
  ): Promise<KSportMatchResponse> {
    const result = new KSportMatchResponse();
    result.result = false;

    const itemAlready = await this.bcToKSportTeamRepository.findOne({
      where: {
        betTeamId: matchRequest.betTeamId,
        KSportTeamId: matchRequest.KSportTeamId,
      },
    });

    if (itemAlready) {
      const item = UpdateBCToKSportTeamDto.matchRequestFactory(
        itemAlready,
        matchRequest
      );
      await item.save();

      result.data = item;
      result.result = true;
      return result;
    }

    const createBetToKSportTeam = CreateBCToKSportTeamDto.matchRequestFactory(
      matchRequest
    );

    const ksportItem = await this.bcToKSportTeamRepository.create(
      createBetToKSportTeam
    );

    result.data = ksportItem;
    result.result = true;

    return result;
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Fetch Updated KSportResult
  ///////////////////////////////////////////////////////////////////////////////
  public async fetchUpdatedKSportResult(
    force?: boolean,
    syncStreamState?: boolean,
    removeLast?: boolean,
    removeExceptKSport?: boolean
  ): Promise<boolean> {
    /* await this.testRepository.create({
      a: JSON.stringify('fetchUpdatedKSportResult:' + moment().format()),
    }); */

    const result = await this.kSportFetchService.fetchUpdated(force);

    if (result && syncStreamState) {
      await this.syncStreamStateByKSportResult();
    }

    if (result && removeLast) {
      const deleteRequest = new KSportDeleteCandidateEventByTimeRequestDto();
      deleteRequest.untilTime = moment()
        .subtract(
          this.configService.get<number>('ksport.stream.durationForRemoveLast'),
          'hours'
        )
        .utcOffset('+08:00')
        .format('YYYY-MM-DD HH:mm:ss');

      await this.deleteCandidateEventByTime(deleteRequest);
    }

    if (result && removeExceptKSport) {
      await this.removeExceptKSport();
    }

    return result;
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Fetch Sync StreamState By KSportResult
  ///////////////////////////////////////////////////////////////////////////////
  public async syncStreamStateByKSportResult(): Promise<boolean> {
    const sportsIds = Object.values(SportsEnum).filter(
      (_sport_id) => typeof _sport_id === 'number'
    );

    for (let i = 0; i < sportsIds.length; i++) {
      const sportId = sportsIds[i];
      const buildStreamStateRequest = new KSportBuildStreamStateRequestDto();

      buildStreamStateRequest.sport = <SportsEnum>sportId;

      await this.buildStreamState(buildStreamStateRequest);
    }

    return true;
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Remove Except KSport
  ///////////////////////////////////////////////////////////////////////////////
  public async removeExceptKSport(): Promise<boolean> {
    const kSportIds = await this.kSportFetchService.getKSportIds();

    if (!kSportIds) {
      return false;
    }

    await this.bcToKSportRepository.destroy({
      where: {
        kSportEventId: {
          [Op.notIn]: kSportIds,
        },
      },
    });

    return true;
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Fetch KSport Result By ID
  ///////////////////////////////////////////////////////////////////////////////
  private async fetchKSportResultById(
    kSportEventId: string
  ): Promise<KSportResultItemDto> {
    const host = this.configService.get<string>('KSPORT_HOST');
    const api = this.configService.get<string>('KSPORT_API');

    try {
      const response = await this.httpService
        .get(`http://${host}${api}`, {
          params: { vid: kSportEventId },
        })
        .toPromise();

      const data = response.data;

      if (!data) {
        return null;
      }

      return data;
    } catch (error) {}

    return null;
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Find Match By BestConstruct AND KSportResut
  ///////////////////////////////////////////////////////////////////////////////
  private findMatchKSportItemByBC(
    streamFindActiveRequest: StreamFindActiveRequestDto,
    kSportResults: KSportResultItemDto[]
  ): KSportResultItemDto {
    const findOptions = new FindMatchKSportEventOptions();
    findOptions.bcTeam1 = streamFindActiveRequest.team1;
    findOptions.bcTeam2 = streamFindActiveRequest.team2;
    findOptions.bcEventTime = `${streamFindActiveRequest.time}`;

    const result = this.findMatchKSportItemsByBC(kSportResults, findOptions);

    if (!result || result.length < 1) {
      return null;
    }

    return result[0].item;
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Find Fuzzy Match KSportItems By BC
  ///////////////////////////////////////////////////////////////////////////////
  private findMatchKSportItemsByBC(
    kSportResults: KSportResultItemDto[],
    findOptions: FindMatchKSportEventOptions
  ): Fuse.FuseResult<KSportResultItemDto>[] {
    const fuse = new Fuse(kSportResults, {
      includeScore: true,
      includeMatches: true,
      useExtendedSearch: true,
      threshold: 0.6,
      minMatchCharLength: 2,
      findAllMatches: true,
      keys: [
        { name: 'Opp1', weight: 10 },
        { name: 'Opp2', weight: 10 },
      ],
    });

    const result: Fuse.FuseResult<KSportResultItemDto>[] = fuse.search({
      $or: [
        {
          $and: [
            { Opp1: `"${findOptions.bcTeam1}"` },
            {
              Opp2: findOptions.bcTeam2
                ? `"${findOptions.bcTeam2}"`
                : `="NULL"`,
            },
          ],
        },
        {
          $and: [
            {
              Opp1: findOptions.bcTeam2
                ? `"${findOptions.bcTeam2}"`
                : `="NULL"`,
            },
            { Opp2: `"${findOptions.bcTeam1}"` },
          ],
        },
      ],
    });

    const bcEventTime = moment.tz(
      findOptions.bcEventTime,
      'YYYY-MM-DD HH:mm',
      'Asia/Shanghai'
    );

    const diffHoursMax =
      this.configService.get<number>('ksport.DIFFHOURSMAX') || 1;

    return result.filter((fuseResultItem) => {
      const kSportItem = fuseResultItem.item;

      const kSportEventTime = moment.unix(kSportItem.Matchtime);

      const diffHours = bcEventTime.diff(kSportEventTime, 'hours');

      return Math.abs(diffHours) <= Math.abs(diffHoursMax);
    });
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Find Match By BestConstruct AND KSportResut
  ///////////////////////////////////////////////////////////////////////////////
  private findMatchCandidateTeamByBC(
    candidateRequest: KSportFindCandidateTeamRequest,
    kSportResults: KSportResultItemDto[]
  ): Fuse.FuseResult<KSportResultItemDto>[] {
    const fuse = new Fuse(kSportResults, {
      includeScore: true,
      includeMatches: true,
      useExtendedSearch: true,
      threshold: 0.6,
      minMatchCharLength: 2,
      keys: ['Opp1', 'Opp2'],
    });

    const result: Fuse.FuseResult<KSportResultItemDto>[] = fuse.search({
      $or: [
        { Opp1: `"${candidateRequest.team}"` },
        { Opp2: `"${candidateRequest.team}"` },
      ],
    });

    if (!result || result.length < 1) {
      return [];
    }

    return result;
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Factory KSportCandidate from FuseResult<KSportResultItemDto>
  ///////////////////////////////////////////////////////////////////////////////
  private factoryKSportCandidateFromFuseKSportResultItem(
    fuseKSportResultItem: Fuse.FuseResult<KSportResultItemDto>
  ): KSportCandidate {
    const candidateItem = new KSportCandidate();

    if (fuseKSportResultItem.matches.length < 1) {
      return null;
    }

    const match = fuseKSportResultItem.matches[0];

    candidateItem.teamId = fuseKSportResultItem.item[`${match.key}ID`];
    candidateItem.team = match.value;

    return candidateItem;
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Build Candidate Event Entity
  ///////////////////////////////////////////////////////////////////////////////
  private async buildCandidateEventEntity(
    sportType: SportsEnum,
    bcItem: BCItemDto,
    ksFuseItems: Fuse.FuseResult<KSportResultItemDto>[],
    checkStreamStatusByDurationBeforePlaying: boolean = false
  ): Promise<BCToKSportModel[]> {
    const items: BCToKSportModel[] = [];
    for (let i = 0; i < ksFuseItems.length; i++) {
      const ksFuseItem = ksFuseItems[i];
      const ksItem = ksFuseItem.item;

      if (checkStreamStatusByDurationBeforePlaying) {
        ksItem.StreamInfo.state = this.checkStatemStatusByDurationBeforePlaying(
          ksItem
        );
      }

      const itemAlready = await this.bcToKSportRepository.findOne({
        where: {
          bcEventId: bcItem.bcEventId,
          kSportEventId: ksItem.vid,
        },
      });
      const itemLikeBC = await this.bcToKSportRepository.findOne({
        where: {
          bcEventId: bcItem.bcEventId,
        },
      });

      if (itemAlready) {
        const bcToKSportItem = UpdateBCToKSportDto.factory(
          itemAlready,
          sportType,
          bcItem,
          ksItem,
          ksFuseItem.score
        );

        if (itemLikeBC) {
          this.syncItemBcEvent(bcToKSportItem, itemLikeBC);
        }

        await bcToKSportItem.save();

        items.push(bcToKSportItem);
        continue;
      }

      const createBCToKSport = CreateBCToKSportDto.factory(
        sportType,
        bcItem,
        ksItem,
        ksFuseItem.score,
        false
      );
      if (itemLikeBC) {
        this.syncCreateBcToKSportByBcEvent(createBCToKSport, itemLikeBC);
      }

      const item = await this.bcToKSportRepository.create(createBCToKSport);

      if (!item) {
        continue;
      }

      items.push(item);
    }

    return items;
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Build Strem State Entity With KSport Result && BCToKSportModel[]
  ///////////////////////////////////////////////////////////////////////////////
  private async buildStreamStateEntities(
    kSportResultItem: KSportResultItemDto,
    bcToKSports: BCToKSportModel[],
    checkStreamStatusByDurationBeforePlaying: boolean = false
  ) {
    if (checkStreamStatusByDurationBeforePlaying) {
      kSportResultItem.StreamInfo.state = this.checkStatemStatusByDurationBeforePlaying(
        kSportResultItem
      );
    }

    for (let i = 0; i < bcToKSports.length; i++) {
      const bcToKSport = bcToKSports[i];

      if (
        kSportResultItem.StreamName === bcToKSport.kSportStreamId &&
        bcToKSport.streamState === kSportResultItem.StreamInfo.state
      ) {
        continue;
      }

      bcToKSport.kSportStreamId = kSportResultItem.StreamName;
      bcToKSport.streamState = kSportResultItem.StreamInfo.state;

      await bcToKSport.save();
    }
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Check StatemSatus By Duration Before Playing
  ///////////////////////////////////////////////////////////////////////////////
  private checkStatemStatusByDurationBeforePlaying(
    kSportResultItem: KSportResultItemDto
  ) {
    if (!kSportResultItem.StreamInfo.state) {
      return false;
    }

    const durationLimit = this.configService.get<number>(
      'ksport.stream.validDurationBeforePlaying'
    );

    const kSportEventTime = moment.unix(kSportResultItem.Matchtime);

    const duration = kSportEventTime.diff(moment(), 'minutes');

    if (duration > durationLimit) {
      console.log(durationLimit, ', ', duration);
    }

    return duration <= durationLimit;
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Sync BcEvent State
  ///////////////////////////////////////////////////////////////////////////////
  private async syncOtherBcEvent(item: BCToKSportModel) {
    const bcEventId = item.bcEventId;
    const isKilled = item.isKilled;

    const otherItems = await this.bcToKSportRepository.findAll({
      where: {
        bcEventId,
        isKilled: !isKilled,
      },
    });

    for (let i = 0; i < otherItems.length; i++) {
      const otherItem = otherItems[i];

      otherItem.isKilled = isKilled;

      await otherItem.save();
    }
  }

  private syncItemBcEvent(dstItem: BCToKSportModel, srcItem: BCToKSportModel) {
    dstItem.isKilled = srcItem.isKilled;
  }

  private syncCreateBcToKSportByBcEvent(
    dstItem: CreateBCToKSportDto,
    srcItem: BCToKSportModel
  ) {
    dstItem.isKilled = srcItem.isKilled;
  }
}
