export class KSportItemResponse {
  kSportEventId: string;
}
export class BcItemResponse {
  bcEventId: string;
  kSportItems: KSportItemResponse[];
}

export class KSportBuildCandidateEventResponseDto {
  result: boolean;
  bcItems: BcItemResponse[];
  ksportresultLength: number;
}
