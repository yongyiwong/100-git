export class CardDepositByCardResult {
  result: boolean;
  bankInfo: {
    bankAccountName: string;
    bankAccountNumber: string;
    bank: {
      bankName: string;
      bankCode: string;
    };
    amount: number;
  };
  errorCode: number;
  errorMessage: string;
}
