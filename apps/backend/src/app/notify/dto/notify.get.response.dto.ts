export class NotifyGetResponseDto {
  result: boolean;
  errorMessage?: string;
  data: {
    numsDepositNew?: number;
    numsWithdrawNew?: number;
  };
}
