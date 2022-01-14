export enum BCWithdrawStatus {
  SUCCESS = 'success',
  FAILED = 'failed'
}

export class BCWithdrawInParams {
  userId: string;
  orderId: number;
  currency: string;
  amount: number;
  status: BCWithdrawStatus;
  reason: string;
}
