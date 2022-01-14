interface IPaymentProvider {
  id: number;
  providerName: string;
  isDepositSupport: boolean;
  isWithdrawalSupport: boolean;
  depositMinAmount: number;
  depositMaxAmount: number;
  withdrawMinAmount: number;
  withdrawMaxAmount: number;
}
