export class HengXinWithdrawRequestParams {
  merId: string;
  version: string;
  data: string;
}

export class HengXinWithdrawRequestData {
  merOrderNo: string;
  amount: number;
  submitTime: string;
  notifyUrl: string;
  bankCode: string;
  bankAccountNo: string;
  bankAccountName: string;
  bankBranchName: string;
  sign: string;
  remarks: string;
}
