import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { QueryTypes } from 'sequelize';
import * as numeral from 'numeral';

@Injectable()
export class DepositOrderAllService {
  constructor(private sequelize: Sequelize) {}

  async findAll() {
    const sql = `
    select 
        pd.id , pd."userId" , pd."date" , pd."orderId" , pd."providerOrderId" , pd.amount , pd.status , 
        pd."channelId" , pd."paymentProviderId" , c2."fromPaymentSystemId" ,
        pd."paymentProviderChannelId", pd."userName", pd."last4Digit",
        pp."providerName", pp."isDepositSupport" , pp."isWithdrawalSupport", pp."isOnlyCardSupport",
        ppc."providerChannelName" , ppc."providerMinAmount" , ppc."providerMaxAmount", ppc."isActive" , ppc."isAvailable" ,
        c2."channelName" , c2."depositOrWithdrawable" , c2."toPaymentSystemId" 
      from  "pendingDeposit" pd 
      left join channel c2 on pd."channelId"  = c2.id
      left join "paymentProviders" pp on pd."paymentProviderId"  = pp.id 
      left join "paymentProviderChannel" ppc on pd."paymentProviderChannelId" = ppc.id 
    union
    select
        d2.id , d2."userId" , d2."date" , d2."orderId" , d2."providerOrderId" , d2.amount , d2.status , 
        d2."channelId" , d2."paymentProviderId" , c3."fromPaymentSystemId" ,
        d2."paymentProviderChannelId", d2."userName", d2."last4Digit",
        pp."providerName", pp."isDepositSupport" , pp."isWithdrawalSupport", pp."isOnlyCardSupport",
        ppc."providerChannelName" , ppc."providerMinAmount" , ppc."providerMaxAmount", ppc."isActive" , ppc."isAvailable" ,
        c3."channelName" , c3."depositOrWithdrawable" , c3."toPaymentSystemId" 
      from deposit d2 
      left join channel c3 on d2."channelId"  = c3.id 
      left join "paymentProviders" pp on d2."paymentProviderId"  = pp.id 
      left join "paymentProviderChannel" ppc on d2."paymentProviderChannelId" = ppc.id
    order by "date" desc, "userId", "id"   `;

    const items = await this.sequelize.query(sql, {
      type: QueryTypes.SELECT,
    });

    const orders = [];

    items.forEach((item) => {
      const order = <
        {
          id: string;
          userId: number;
          date: string;
          orderId: number;
          providerOrderId: string;
          amount: number;
          status: string;
          userName: string;
          last4Digit: string;
          paymentProvider: {
            id: number;
            providerName: string;
            isDepositSupport: boolean;
            isWithdrawalSupport: boolean;
            isOnlyCardSupport: boolean;
          };
          paymentProviderChannel: {
            id: number;
            providerChannelName: string;
            providerMinAmount: number;
            providerMaxAmount: number;
            isActive: boolean;
            isAvailable: boolean;
          };
          channel: {
            id: number;
            channelName: string;
            depositOrWithdrawable: number;
            fromPaymentSystemId: number;
            toPaymentSystemId: number;
          };
        }
      >{};

      order.id = item['id'];
      order.userId = numeral(item['userId']).value();
      order.date = item['date'];
      order.orderId = numeral(item['orderId']).value();
      order.providerOrderId = item['providerOrderId'];
      order.amount = numeral(item['amount']).value();
      order.status = item['status'];
      order.userName = item['userName'];
      order.last4Digit = item['last4Digit'];
      order.paymentProvider = {
        id: numeral(item['paymentProviderId']).value(),
        providerName: item['providerName'],
        isDepositSupport: JSON.parse(item['isDepositSupport']),
        isWithdrawalSupport: JSON.parse(item['isWithdrawalSupport']),
        isOnlyCardSupport: JSON.parse(item['isOnlyCardSupport']),
      };
      order.paymentProviderChannel = {
        id: numeral(item['paymentProviderChannelId']).value(),
        providerChannelName: item['providerChannelName'],
        providerMinAmount: numeral(item['providerMinAmount']).value(),
        providerMaxAmount: numeral(item['providerMaxAmount']).value(),
        isActive: JSON.parse(item['isActive']),
        isAvailable: JSON.parse(item['isAvailable']),
      };
      order.channel = {
        id: numeral(item['channelId']).value(),
        channelName: item['channelName'],
        depositOrWithdrawable: numeral(item['depositOrWithdrawable']).value(),
        fromPaymentSystemId: numeral(item['fromPaymentSystemId']).value(),
        toPaymentSystemId: numeral(item['toPaymentSystemId']).value(),
      };

      orders.push(order);
    });

    return orders;
  }
}
