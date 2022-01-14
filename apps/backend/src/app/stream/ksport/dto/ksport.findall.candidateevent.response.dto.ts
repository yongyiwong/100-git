import { BCToKSportModel } from '../entities/bc.ksport.entity';

export class KSportFindAllCandidateEventResponseDto {
  total: number;
  items: BCToKSportModel[];
}
