import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { KSportService } from './ksport.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { apiPathsEnum, apiTagsEnum } from '@workspace/enums';
import { KSportFindAllCandidateEventRequestDto } from './dto/ksport.findall.candidateevent.request.dto';
import { KSportFindAllCandidateEventResponseDto } from './dto/ksport.findall.candidateevent.response.dto';
import { KSportBuildCandidateEventRequestDto } from './dto/ksport.build.candidateevent.request.dto';
import { KSportBuildCandidateEventResponseDto } from './dto/ksport.build.candidateevent.response.dto';
import { KSportCreateCandidateEventRequestDto } from './dto/ksport.create.candidateevent.request.dto';
import { KSportCreateCandidateEventResponseDto } from './dto/ksport.create.candidateevent.response.dto';
import { KSportDeleteCandidateEventRequestDto } from './dto/ksport.delete.candidateevent.request.dto';
import { KSportDeleteCandidateEventResponseDto } from './dto/ksport.delete.candidateevent.response.dto';
import { KSportFindCandidateTeamRequest } from './dto/ksport.find.candidateteam.request.dto';
import { KSportFindCandidateTeamResponse } from './dto/ksport.find.candidateteam.response.dto';
import { KSportMatchRequest } from './dto/ksport.match.request.dto';
import { KSportMatchResponse } from './dto/ksport.match.response.dto';
import { KSportSetCandidateEventCorrectRequestDto } from './dto/ksport.set.candidateevent.correct.request.dto';
import { KSportSetCandidateEventCorrectResponseDto } from './dto/ksport.set.candidateevent.correct.response.dto';
import { KSportUpdateCandidateEventRequestDto } from './dto/ksport.update.candidateevent.request.dto';
import { KSportUpdateCandidateEventResponseDto } from './dto/ksport.update.candidateevent.response.dto';
import { KSportBuildStreamStateRequestDto } from './dto/ksport.build.streamstate.request.dto';
import { KSportBuildStreamStateResponseDto } from './dto/ksport.build.streamstate.response.dto';
import { KSportBuildStreamStateSomeRequestDto } from './dto/ksport.build.streamstate.some.request.dto';
import { KSportBuildStreamStateSomeResponseDto } from './dto/ksport.build.streamstate.some.response.dto';
import { KSportGetStreamStateSomeRequestDto } from './dto/ksport.get.streamstate.some.request.dto';
import { KSportGetStreamStateSomeResponseDto } from './dto/ksport.get.streamstate.some.response.dto';
import { KSportDeleteCandidateEventByTimeResponseDto } from './dto/ksport.delete.candidateevent.bytime.response.dto';
import { KSportDeleteCandidateEventByTimeRequestDto } from './dto/ksport.delete.candidateevent.bytime.request.dto';
import { KSportFetchUpdateRequestDto } from './dto/ksport.fetchupdate.request.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('ksport')
@ApiTags(apiTagsEnum.streamEndpoints)
export class KSportController {
  constructor(private readonly ksportService: KSportService) {}

  @Post(apiPathsEnum.getStreamStateSome)
  getStreamStateSome(
    @Body() query: KSportGetStreamStateSomeRequestDto
  ): Promise<KSportGetStreamStateSomeResponseDto> {
    return this.ksportService.getStreamStateSome(query);
  }

  @Post(apiPathsEnum.fetchUpdate)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  fetchUpdate(@Body() query: KSportFetchUpdateRequestDto): Promise<boolean> {
    return this.ksportService.fetchUpdatedKSportResult(true, true, true, true);
  }

  @Post(apiPathsEnum.buildStreamState)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  buildStremState(
    @Body() query: KSportBuildStreamStateRequestDto
  ): Promise<KSportBuildStreamStateResponseDto> {
    return this.ksportService.buildStreamState(query);
  }

  @Post(apiPathsEnum.buildStreamStateSome)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  buildStremStateSome(
    @Body() query: KSportBuildStreamStateSomeRequestDto
  ): Promise<KSportBuildStreamStateSomeResponseDto> {
    return this.ksportService.buildStreamStateSome(query);
  }

  @Get(apiPathsEnum.findallKSportCandidateEvent)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findallCandidateEvent(
    @Query() query: KSportFindAllCandidateEventRequestDto
  ): Promise<KSportFindAllCandidateEventResponseDto> {
    return this.ksportService.findAllCandidateEvent(query);
  }

  @Post(apiPathsEnum.buildKSportCandidateEventByBet)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  buildCandidateEvent(
    @Body() candidateEventRequest: KSportBuildCandidateEventRequestDto
  ): Promise<KSportBuildCandidateEventResponseDto> {
    return this.ksportService.buildCandidateEventByBC(candidateEventRequest);
  }

  @Post(apiPathsEnum.createKSportCandidateEvent)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  createCandidateEvent(
    @Body()
    createCandidateEventRequest: KSportCreateCandidateEventRequestDto
  ): Promise<KSportCreateCandidateEventResponseDto> {
    return this.ksportService.createCandidateEvent(createCandidateEventRequest);
  }

  @Post(apiPathsEnum.updateKSportCandidateEvent)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  updateCandidateEvent(
    @Body()
    updateCandidateEventRequest: KSportUpdateCandidateEventRequestDto
  ): Promise<KSportUpdateCandidateEventResponseDto> {
    return this.ksportService.updateCandidateEvent(updateCandidateEventRequest);
  }

  @Post(apiPathsEnum.deleteKSportCandidateEvent)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  deleteCandidateEvent(
    @Body()
    deleteCandidateEventRequest: KSportDeleteCandidateEventRequestDto
  ): Promise<KSportDeleteCandidateEventResponseDto> {
    return this.ksportService.deleteCandidateEvent(deleteCandidateEventRequest);
  }

  @Post(apiPathsEnum.deleteKSportCandidateEventByTime)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  deleteCandidateEventByTime(
    @Body()
    deleteCandidateEventByTimeRequest: KSportDeleteCandidateEventByTimeRequestDto
  ): Promise<KSportDeleteCandidateEventByTimeResponseDto> {
    return this.ksportService.deleteCandidateEventByTime(
      deleteCandidateEventByTimeRequest
    );
  }

  @Post(apiPathsEnum.setKSportCandidateEventCorrect)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  setCandidateEventCorrect(
    @Body() query: KSportSetCandidateEventCorrectRequestDto
  ): Promise<KSportSetCandidateEventCorrectResponseDto> {
    return this.ksportService.setCandidateEventCorrect(query);
  }

  @Get(apiPathsEnum.findKSportCandidateTeam)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findCandidateTeam(
    @Query() query: KSportFindCandidateTeamRequest
  ): Promise<KSportFindCandidateTeamResponse> {
    return this.ksportService.findCandidateTeamByBC(query);
  }

  @Post(apiPathsEnum.setKSportMatchTeam)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  setMatchTeam(
    @Query() matchRequest: KSportMatchRequest
  ): Promise<KSportMatchResponse> {
    return this.ksportService.setMatchTeamByBC(matchRequest);
  }
}
