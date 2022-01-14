import { Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { apiPathsEnum, apiTagsEnum } from '@workspace/enums';
import { StreamService } from './stream.service';
import {
  StreamFindActiveByBCRequestDto,
  StreamFindActiveByBCResponseDto,
  StreamFindActiveRequestDto,
  StreamFindActiveResponseDto,
} from '@workspace/dto';
import {FileManager} from '../shared/file.manage';

@Controller(apiPathsEnum.stream)
@ApiTags(apiTagsEnum.streamEndpoints)
export class StreamController {
  constructor(private readonly streamService: StreamService) {}

  // @Get(apiPathsEnum.getStream)
  // findActive(
  //   @Query() query: StreamFindActiveRequestDto
  // ): Promise<StreamFindActiveResponseDto> {
  //   // FileManager.writeFileAsync( 'streamtmp/test.txt', '你們好');    
  //   // FileManager.readFileASync( 'streamtmp/test.txt');    
  //   return null;
  //   return this.streamService.findActiveStream(query);
  // }

  @Get(apiPathsEnum.getStreamByBC)
  findActiveByBC(
    @Query() query: StreamFindActiveByBCRequestDto
  ): Promise<StreamFindActiveByBCResponseDto> {
    return this.streamService.findActiveStreamByBC(query);
  }
}
