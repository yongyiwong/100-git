export class KSportStreamInfo {
  state: boolean;
  kbps: number;
}

export class KSportOdd {
  Home: number;
  Draw: number;
  Away: number;
}

export class KSportOdds {
  Euro: KSportOdd;
  Letgoal: KSportOdd;
  Score: KSportOdd;
}

export class KSportMatchInfo {
  Section: number;
  PlayingTime: number;
  AddTime: number;
  YellowCard1: number;
  YellowCard2: number;
  RedCard1: number;
  RedCard2: number;
  Status: number;
}

export class KSportResultItemDto {
  Liga: string;
  Opp1: string;
  Opp2: string;
  Sport: string;
  Opp1ID: string;
  Opp2ID: string;
  LeagueID: string;
  vid: string;
  Scores: string;
  SportId: number;
  Time: string;
  StreamName: string;
  Matchtime: number;
  StreamType: string;
  StreamFrom: string;
  StreamInfo: KSportStreamInfo;
  Odds: KSportOdds;
  MatchInfo: KSportMatchInfo;
  StreamSource: number;
}
