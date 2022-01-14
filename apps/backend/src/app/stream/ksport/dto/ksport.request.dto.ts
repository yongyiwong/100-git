import { StreamFindActiveRequestDto } from '@workspace/dto';
import { SportsEnum } from '@workspace/enums';
import { KSportFindCandidateTeamRequest } from './ksport.find.candidateteam.request.dto';

export class KSportRequestDto {
  id: string;
  key: string;
  lng: string;
  type: string;

  static sportFactory(): KSportRequestDto {
    const ksportRequest = new KSportRequestDto();

    //ksportRequest.id = SportsEnum[sport];
    ksportRequest.lng = 'en';
    ksportRequest.type = 'json';

    return ksportRequest;
  }

  static streamFindActiveRequestFactory(
    streamFindActiveRequest: StreamFindActiveRequestDto,
    key: string
  ): KSportRequestDto {
    const ksportRequest = new KSportRequestDto();

    ksportRequest.id = `${streamFindActiveRequest.sport}`;
    ksportRequest.key = key;
    ksportRequest.lng = 'en';
    ksportRequest.type = 'json';

    return ksportRequest;
  }

  static ksportCandidateRequestFactory(
    candidateRequest: KSportFindCandidateTeamRequest,
    key: string
  ): KSportRequestDto {
    const ksportRequest = new KSportRequestDto();

    ksportRequest.id = `${candidateRequest.sport}`;
    ksportRequest.key = key;
    ksportRequest.lng = 'en';
    ksportRequest.type = 'json';

    return ksportRequest;
  }
}
