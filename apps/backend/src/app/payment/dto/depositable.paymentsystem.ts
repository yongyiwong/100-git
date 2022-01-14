export class DepositablePaymentSystem {
  id: number;
  paymentMethodName: string;
  isAvailable: boolean;
  minAmount: number;
  maxAmount: number;
  locales: {
    [key: string]: string;
  };
}
