import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KSportResultItemDto } from '../ksport/dto/ksport.result.item.dto';
import { TencentRequestDto } from './dto/tencent.request.dto';
import * as tencentcloud from 'tencentcloud-sdk-nodejs';
import { TencentResultDto } from './dto/tencent.result.dto';
import { TencentStreamStateEnum } from './enums/tencent.stream.state.enum';

import * as moment from 'moment';
import * as md5 from 'md5';
import { TencemtGetStreamStateExeception } from '../stream.exeception';

@Injectable()
export class TencentService {
  constructor(private configService: ConfigService) {}

  async findActiveStream(kSportStreamId: string): Promise<string> {
    const streamState = await this.getStreamState(kSportStreamId);

    if (streamState !== TencentStreamStateEnum.ACTIVE) {
      //throw new StreamUnavailableExeception();
      return null;
    }

    const streamUrl = this.getStreamUrl(kSportStreamId);

    return streamUrl;
  }

  private async getStreamState(
    ksportStreamId: string
  ): Promise<TencentStreamStateEnum> {
    let streamState = TencentStreamStateEnum.INACTIVE;

    const LiveClient = tencentcloud.live.v20180801.Client;

    const host = this.configService.get<string>('TENCENT_HOST');

    const clientConfig = {
      credential: {
        secretId: this.configService.get<string>('TENCENT_SECRET_ID'),
        secretKey: this.configService.get<string>('TENCENT_SECRET_KEY'),
      },
      region: '',
      profile: {
        httpProfile: {
          endpoint: host,
        },
      },
    };

    const client = new LiveClient(clientConfig);

    const params = new TencentRequestDto();

    params.AppName = this.configService.get<string>('TENCENT_PUSH_APPNAME');
    params.DomainName = this.configService.get<string>('TENCENT_PUSH_DOMAIN');
    params.StreamName = ksportStreamId;

    try {
      const data = await client.DescribeLiveStreamState(params);

      const result = TencentResultDto.responseFactory(data);

      streamState = result.StreamState;
    } catch (error) {
      throw new TencemtGetStreamStateExeception();
    }

    return streamState;
  }

  private getStreamUrl(kSportStreamId: string): string {
    const pullDomain = this.configService.get<string>('TENCENT_PULL_DOMAIN');
    const pullAppName = this.configService.get<string>('TENCENT_PULL_APPNAME');
    const deltaExpiration = this.configService.get<string>(
      'TENCENT_DELTA_EXPIRATION_MINUTES'
    );
    const expirationTime = moment().add(deltaExpiration, 'minutes');
    const txTime = expirationTime.unix().toString(16);

    const key = this.configService.get<string>('TENCENT_PULL_COPYRIGHTKEY');

    const txSecret = md5(`${key}${kSportStreamId}${txTime}`);

    const streamUrl =
      `https://${pullDomain}/${pullAppName}/` +
      `${kSportStreamId}.m3u8?` +
      `txSecret=${txSecret}` +
      `&txTime=${txTime}`;

    return streamUrl;
  }
}
