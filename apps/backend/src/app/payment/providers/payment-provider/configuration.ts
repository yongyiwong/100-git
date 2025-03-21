import { CurrencyEnum } from '@workspace/enums';

export default () => ({
  ORDER_NUMBER_PREFIX: 'ORDER',
  FROZEN_PERIOD: 1, // MINUTES
  PAYMENTPROVIDER_DEBUG: true,
  testUserId: 323172552,
  withdrawMinAmountDelta: 5,
  betConstruct: {
    numberOfTasksProcessed: 20,
    checkClient: {
      command: 'check',
    },
    alreadySuccessProcessedBCOrderErrorCode: 602,
    alreadySuccessProcessedBCOrderErrorMessage:
      'This Order is already processed with success',
    badStatusErrorCode: 603,
    badStatusErrorMessage: 'Unknown Status',
    deposit: {
      command: 'pay',
      notCreateBCOrdersRecordErrorCode: 601,
      notCreateBCOrdersRecordErrorMessage: 'Can not create BC Order Record',
    },
    withdraw: {
      command: 'withdraw',
      checkIPWhiteListErrorCode: 500,
      checkIPWhiteListErrorMessage: 'Invalid IP',
      checkHashErrorCode: 501,
      checkHashErrorMessage: 'Invalid HashCode',
      reason: '100Bet Withdraw Default Reason',
      serviceErrorCode: 502,
      serviceErrorMessage: 'Bet Construct Service has withdraw problem',
      defaultReason: '100Bet Withdraw Reason',
    },
  },
  minDeposit: {
    AMOUNT: 1,
    USERID: 123456,
    D1FBANKID: 1,
    USERAGENT:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36',
    IP: '192.169.1.101',
  },
  minWithdraw: {
    AMOUNT: 1,
    USERID_PREFIX: '12345',
    HASHCODE: '1234567890123456789012',
    BANKACCOUNTNUMBER_PREFIX: '1234567890',
    BANKACCOUNTNAME_PREFIX: 'testBankAccount',
    CITY: 'testCity',
    PROVINCE: 'testProvince',
    CURRENCY: CurrencyEnum.CNY,
  },
  mszf: {
    DEPOSIT_SUCCESS_URL: '/payment/mszfcallback/deposit',
    WITHDRAWAL_SUCCESS_URL: '/payment/mszfcallback/withdraw',
    SIGN_ERROR_CODE: -1000,
    DEPOSIT_MINAMOUNT_ERROR_CODE: 101,
    WITHDRAW_MINAMOUNT_ERROR_CODE: 101,
    DEFAULT_ERROR_CODE: -1,
    DEPOSIT_FROZEN_CODE: [999, 102, 202],
    WITHDRAW_FROZEN_CODE: [999, 102, 202],
  },
  d1f: {
    DEPOSIT_SUCCESS_URL: '/payment/d1fcallback/deposit',
    WITHDRAWAL_SUCCESS_URL: '/payment/d1fcallback/withdraw',
    DEFAULT_ERROR_CODE: -1,
    FROZEN_CODE: [101],
  },
  xingchen: {
    DEPOSIT_SUCCESS_URL: '/payment/xingchencallback/deposit',
    WITHDRAWAL_SUCCESS_URL: '/payment/xingchencallback/withdraw',
    DEPOSIT_MINAMOUNT_ERROR_CODE: 115,
    WITHDRAW_MINAMOUNT_ERROR_CODE: 109,
    DEFAULT_ERROR_CODE: -1,
    DEPOSIT_FROZEN_CODE: [111],
    WITHDRAW_FROZEN_CODE: [111],
  },
  uzpay: {
    DEPOSIT_SUCCESS_URL: '/payment/uzpaycallback/deposit',
    WITHDRAWAL_SUCCESS_URL: '/payment/uzpaycallback/withdraw',
    DEPOSIT_MINAMOUNT_ERROR_CODE: 102,
    WITHDRAW_MINAMOUNT_ERROR_CODE: 204,
    DEFAULT_ERROR_CODE: -1,
    OTHER_BANKFLAG: '二维码',
    DEPOSIT_FROZEN_CODE: [104, 106],
    WITHDRAW_FROZEN_CODE: [205],
  },
  sdd: {
    DEPOSIT_SUCCESS_URL: '/payment/sddcallback/deposit',
    WITHDRAWAL_SUCCESS_URL: '/payment/sddcallback/withdraw',
    DEPOSIT_MINAMOUNT_ERROR_CODE: 100,
    WITHDRAW_MINAMOUNT_ERROR_CODE: 200,
    DEFAULT_ERROR_CODE: -1,
  },
  hengxin: {
    DEPOSIT_SUCCESS_URL: '/payment/hengxincallback/deposit',
    WITHDRAWAL_SUCCESS_URL: '/payment/hengxincallback/withdraw',
    remarks: 'xxRemarks',
    DEFAULT_ERROR_CODE: -1,
    DEPOSIT_FROZEN_CODE: [],
    WITHDRAW_FROZEN_CODE: [556, 559, 562],
  },
  jbp: {
    DEPOSIT_SUCCESS_URL: '/payment/jbpcallback/deposit',
    WITHDRAWAL_SUCCESS_URL: '/payment/jbpcallback/withdraw',
    DEFAULT_ERROR_CODE: -1,
    DEPOSIT_FROZEN_CODE: [6020],
    WITHDRAW_FROZEN_CODE: [6020],
  },
  bisa: {
    DEPOSIT_SUCCESS_URL: '/payment/bisacallback/deposit',
    WITHDRAWAL_SUCCESS_URL: '/payment/bisacallback/withdraw',
    DEFAULT_ERROR_CODE: -1,
    DEPOSIT_FROZEN_CODE: [],
    WITHDRAW_FROZEN_CODE: [],
  },
});
