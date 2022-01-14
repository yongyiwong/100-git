export class KSportCandidate {
  teamId: string;
  team: string;
}

export class KSportFindCandidateTeamResponse {
  result: boolean;
  datetime: string;
  items: KSportCandidate[];
  message: string;
}
