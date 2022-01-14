export interface PaymentDepositByCardRequest {
  userId: number;
  amount: number;
  userName: string;
  last4Digit: string;
  hash: string;
}
