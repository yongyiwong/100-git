export const MSG_NO_WITHDRAWAL_ORDER = 'There is no order';
export const MSG_STREAM_NO_KSPORT_MATCH = 'There is no ksport match';
export const MSG_STREAM_UNAVAILABLE = 'Stream does not exist yet';
export const MSG_KSPORT_FETCH_ERROR = 'Fetching ksport data has error';
export const MSG_KSPORT_CANDIDATE_INTERAL_ERROR =
  'Getting KSport candidate team has internal error';
export const MSG_KSPORT_NO_MATCHED_EVENT_ERROR =
  'There is no such matched event';
export const MSG_KSPORT_EXIST_CANDIDATE = 'There is already candidate event';
export const MSG_KSPORT_NO_EXIST_CANDIDATE =
  'There is no exist candidate event';
export const MSG_KSPORT_CREATE_CANDIDATE_EVENT_ERROR =
  'Creating Candidate Event has error';
export const MSG_MSZF_REQUEST_SIGNERROR = 'MSZF Request has invalid sign';
export const MSG_MSZF_RESPONSE_SIGNERROR = 'MSZF Response has invalid sign';
export const MSG_MSZF_CALLBACK_SIGNERROR = 'MSZF callback request is not valid';
export const PAYMENT_DEPOSIT_ERROR = {
  bcClient: {
    en: 'Your account has not been added to our system yet.',
    zh: '您的账户尚未添加入我们系统中。',
  },
  paymentProviderIntegration: {
    en:
      ' Your money has not been deposited successfully. Your order number is %{orderId} please contact to customer service.',
    zh: '您的存款未成功。您的订单号是%{orderId}，请联系客服。',
  },
  noPaymentProvider: {
    en:
      'Sorry, Problem happened when depositing. Please try again later or contact to customer service.',
    zh: '我们向您致歉，存款时发生了问题。请稍后再试或联系客服。',
  },
};
