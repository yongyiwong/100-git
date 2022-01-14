import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  StreamFindActiveByBCRequestDto,
  StreamFindActiveByBCResponseDto,
  StreamFindActiveRequestDto,
  StreamFindActiveResponseDto,
} from '@workspace/dto';
import * as Locale from '../locale';
import { KSportService } from './ksport/ksport.service';
import { TencentService } from './tencent/tencent.service';
import * as moment from 'moment';
import { InjectModel } from '@nestjs/sequelize';
import { BCToKSportModel } from './ksport/entities/bc.ksport.entity';
import { WhereOptions, Op } from 'sequelize';
import { FileManager } from '../shared/file.manage';
import { KSportResultItemDto } from './ksport/dto/ksport.result.item.dto';
import { ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize-typescript';
import { LocaleEnum } from '@workspace/enums';

@Injectable()
export class StreamService {
  constructor(
    private ksportService: KSportService,
    private tecentSercice: TencentService,

    @InjectModel(BCToKSportModel)
    private bcToKSportRepository: typeof BCToKSportModel
  ) {}

  async findActiveStreamByBC(
    request: StreamFindActiveByBCRequestDto
  ): Promise<StreamFindActiveByBCResponseDto> {
    const streamResult = new StreamFindActiveByBCResponseDto();
    streamResult.result = false;

    const bcEventId = request.bcEventId;
    const localeId: number = LocaleEnum[request.locale];

    const bcToKSport = await this.bcToKSportRepository.findOne({
      attributes: [
        [
          Sequelize.literal('distinct on("bcEventId") "bcEventId"'),
          'bcEventId',
        ],
        'streamState',
        'isManual',
        'correct',
        'matchScore',
        'kSportStreamId',
        'kSportEventId',
      ],
      where: {
        bcEventId,
        //correct: true,
      },
      order: [
        ['bcEventId', 'ASC'],
        ['isManual', 'DESC'],
        ['correct', 'DESC'],
        ['matchScore', 'ASC'],
        ['streamState', 'DESC'],
        ['isStreamCn', localeId === LocaleEnum.cn ? 'DESC' : 'ASC'],
        ['isStreamHd', 'DESC'],
      ],
    });

    if (!bcToKSport) {
      streamResult.message = Locale.MSG_STREAM_NO_KSPORT_MATCH;
      return streamResult;
    }

    if (!bcToKSport.streamState) {
      streamResult.message = Locale.MSG_STREAM_UNAVAILABLE;
      return streamResult;
    }

    const streamUrl = await this.tecentSercice.findActiveStream(
      bcToKSport.kSportStreamId
    );

    if (!streamUrl) {
      streamResult.message = Locale.MSG_STREAM_UNAVAILABLE;
      return streamResult;
    }

    streamResult.result = true;
    streamResult.streamUrl = streamUrl;

    return streamResult;
  }

  async findActiveStream(streamFindActiveRequest: StreamFindActiveRequestDto) {
    const streamResult = new StreamFindActiveResponseDto();
    streamResult.result = false;

    const findItem = await this.ksportService.findByBC(streamFindActiveRequest);

    if (!findItem) {
      streamResult.message = Locale.MSG_STREAM_NO_KSPORT_MATCH;
      return streamResult;
    }

    if (
      !findItem.StreamInfo ||
      (findItem.StreamInfo && !findItem.StreamInfo.state)
    ) {
      streamResult.message = Locale.MSG_STREAM_UNAVAILABLE;
      return streamResult;
    }

    const streamUrl = await this.tecentSercice.findActiveStream(
      findItem.StreamName
    );
    if (!streamUrl) {
      streamResult.message = Locale.MSG_STREAM_UNAVAILABLE;
      return streamResult;
    }

    streamResult.result = true;
    streamResult.streamUrl = streamUrl;

    return streamResult;
  }
}
