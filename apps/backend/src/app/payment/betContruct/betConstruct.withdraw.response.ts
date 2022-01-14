import { MSG_NO_WITHDRAWAL_ORDER } from '../../locale';
import { WithdrawPendingOrderModel } from '../../models/withdraw.pending.order.model';

export class BetConstructWithdrawalResponse {
  result: boolean;
  message: string;
  data: {
    orderId: string;
    amount: string;
    currency: string;
    status: string;
  };

  static responseFactory(
    orderModel: WithdrawPendingOrderModel
  ): BetConstructWithdrawalResponse {
    const betResponse: BetConstructWithdrawalResponse = new BetConstructWithdrawalResponse();
    betResponse.message = '';
    if (!orderModel) {
      betResponse.message = MSG_NO_WITHDRAWAL_ORDER;
      betResponse.result = false;
      betResponse.data = null;
      return betResponse;
    }
    betResponse.result = true;
    betResponse.data = {
      orderId: orderModel.orderId,
      amount: orderModel.amount.toString(),
      currency: orderModel.currency,
      status: orderModel.status,
    };
    return betResponse;
  }
}
