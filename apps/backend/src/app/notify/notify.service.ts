import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { NotifyGetRequestDto } from './dto/notify.get.request.dto';
import { FindOptions, Op, QueryTypes, SaveOptions } from 'sequelize';
import { NotifyGetResponseDto } from './dto/notify.get.response.dto';
import * as numeral from 'numeral';

@Injectable()
export class NotifyService {
  constructor(private sequelize: Sequelize) {}

  async gets(request: NotifyGetRequestDto) {
    const response: NotifyGetResponseDto = {
      result: false,
      data: {},
    };

    let sql = '';
    let items = [];

    if (request.depositOrderLatest) {
      sql = `
      select 
      count(*) "cnt"
      from (
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
          where pd."date" >= to_date('${request.depositOrderLatest.date}', 'MM/DD/YYYY' )
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
          where d2."date" >= to_date('${request.depositOrderLatest.date}', 'MM/DD/YYYY' ) 
      ) a`;

      items = await this.sequelize.query(sql, {
        type: QueryTypes.SELECT,
      });

      const numDepositsLatest = numeral(items[0]['cnt']).value();

      response.data.numsDepositNew =
        numDepositsLatest - request.depositOrderLatest.nums;
    }

    if (request.withdrawOrderLatest) {
      sql = `
      select 
        count(*) "cnt"
        from (
          select 
              pw.id , pw."userId" , pw."date" , pw."orderId" , pw."clientOrderId" , pw.amount ,
              pw."providerOrderId" , pw.status ,
              pw."paymentProviderId" , pp."providerName", pp."isDepositSupport" , pp."isWithdrawalSupport", pp."isOnlyCardSupport",
              pw.currency , pw.hashcode , pw."errorCode" , pw."errorMessage" ,
              pw."bankId", pw."bankAccountName", pw."bankAccountNumber", 
              pw."province", pw."city", pw."branch",
              pw."userName", pw."phoneNumber", pw."countryCallingCode",
              ppb."paymentProviderBankCode" , ppb."paymentProviderBankName" , ppb.id "paymentProviderBankId",
              pw."currency", bk."bankName", bk."bankCode"
            from "pendingWithdraw" pw 
            left join "paymentProviders" pp on pw."paymentProviderId" = pp.id 
            left join "paymentProviderBank" ppb on pw."paymentProviderId" =  ppb."paymentProviderId" AND pw."bankId" = ppb."bankId"
            left join "bank" bk on bk."id" = ppb."bankId"
            where pw."date" >= to_date('${request.withdrawOrderLatest.date}', 'MM/DD/YYYY' )
          union
          select
              w.id, w."userId", w."date" , w."orderId" , w."clientOrderId" , w.amount ,
              w."providerOrderId" , w.status ,
              w."paymentProviderId", pp."providerName", pp."isDepositSupport" , pp."isWithdrawalSupport", pp."isOnlyCardSupport",
              w.currency , w.hashcode , w."errorCode" , w."errorMessage" ,
              w."bankId", w."bankAccountName", w."bankAccountNumber", 
              w."province", w."city", w."branch",
              w."userName", w."phoneNumber", w."countryCallingCode",
              ppb."paymentProviderBankCode" , ppb."paymentProviderBankName" , ppb.id "paymentProviderBankId",
              w."currency", bk."bankName", bk."bankCode"
            from withdraw w 
            left join "paymentProviders" pp on w."paymentProviderId" = pp.id
            left join "paymentProviderBank" ppb on w."paymentProviderId" =  ppb."paymentProviderId" AND w."bankId" = ppb."bankId"
            left join "bank" bk on bk."id" = ppb."bankId"
            where w."date" >= to_date('${request.withdrawOrderLatest.date}', 'MM/DD/YYYY' )
          order by "date" desc, "userId", "id"
      ) a`;

      items = await this.sequelize.query(sql, {
        type: QueryTypes.SELECT,
      });

      const numWithdrawsLatest = numeral(items[0]['cnt']).value();

      response.data.numsWithdrawNew =
        numWithdrawsLatest - request.withdrawOrderLatest.nums;
    }

    response.result = true;
    return response;
  }
}
