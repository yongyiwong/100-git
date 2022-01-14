import { ApiProperty } from '@nestjs/swagger';

export class KSportBuildStreamStateSomeRequestDto {
  @ApiProperty()
  bcEventIDs: string[];
}
