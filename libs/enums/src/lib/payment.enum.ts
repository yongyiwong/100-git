export enum OrderStatusEnum {
  NEW = 'new',
  WAITINGPAID = 'readyToPay',
  PENDING = 'pending',
  FAILED = 'failed',
  SUCCESS = 'success',
}

export enum LocaleEnum {
  en = 1,
  cn = 2,
}

export enum PaymentSystemEnum {
  ALIPAY = 1,
  WECHAT = 2,
  BANK = 3,
  UNIONPAYAPP = 4,
  USDT = 5,
}

export enum DepositChannelEnum {
  ALIPAYTOBANK = 1,
  WECHATTOBANK = 2,
  BANKTOBANK = 3,
  BANKTOALIPAY = 4,
}

export enum BankCodeEnum {
  ICBC = 1,
  ABOC = 2,
  BOC = 3,
  CCB = 4,
  BOCOM = 5,
  PSBC = 6,
  CEB = 7,
  CMBC = 8,
  CMB = 9,
  ECITIC = 10,
  HXB = 11,
  SPDB = 12,
  PAB = 13,
  CGB = 14,
  CIB = 15,
  BOB = 16,
  BOS = 17,
  NBCB = 18,
  HZB = 19,
  BCRCB = 20,
  HCCBCNBH = 21,
  ZJCBCN2N = 22,
  CHCCCNSS = 23,
  QCCBCNBQ = 24,
}

export enum PaymentProviderEnum {
  MSZF = 1,
  D1F = 2,
  XINGCHEN = 3,
  UZPAY = 4,
  SDD = 5,
  HENGXIN = 6,
  JBP = 7,
  SXC = 8,
  DBPay = 9,
  Bisa = 10,
}

export enum CurrencyEnum {
  USD = 'USD',
  EUR = 'EUR',
  BRI = 'BRI',
  CNY = 'CNY',
}

export enum UsdtProtocolEnum {
  TRC20 = 1,
  ERC20 = 2,
  OMNI = 3,
  BEP2 = 4,
  EOS = 5,
  Algorand = 6,
}
