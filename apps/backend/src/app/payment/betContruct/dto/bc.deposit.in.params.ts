export enum BCDepositStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
}

export class BCDepositInParams {
  orderId: number;
  userId: number;
  amount: number;
  currency: string;
}
