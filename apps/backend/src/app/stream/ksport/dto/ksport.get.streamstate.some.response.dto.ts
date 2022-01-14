export class KSportGetStreamStateSomeResponseDto {
  result: boolean;
  message: string;
  data: {
    [key: string]: {
      streamState: boolean;
      isManual: boolean;
      correct: boolean;
      matchScore: number;
    };
  };
}
