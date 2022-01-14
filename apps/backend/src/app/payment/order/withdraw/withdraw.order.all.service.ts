import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { QueryTypes } from 'sequelize';
import * as numeral from 'numeral';
import { GetWithdrawOrderAllRequestDto } from './dto/get.withdraw.order.all.request.dto';

const filterKeys = {
  userId: { type: 'string' }
};

@Injectable()
export class WithdrawOrderAllService {
  constructor(private sequelize: Sequelize) { }

  async findAll(request: GetWithdrawOrderAllRequestDto) {

    let sql_where_1 = '';
    let sql_where_2 = '';
    let prefix = '';
    request.filters.forEach(_ => {
      const filterKey = filterKeys[_.key];
      if (!filterKey) {
        return;
      }

      const value = filterKey.type === 'number' ? _.value : `'${_.value}'`;

      prefix = sql_where_1.length > 0 ? "AND" : "";
      sql_where_1 += ` ${prefix} pw."${_.key}" = ${value}`;

      prefix = sql_where_2.length > 0 ? "AND" : "";
      sql_where_2 += ` ${prefix} w."${_.key}" = ${value}`;
    });

    if (sql_where_1.length > 0) sql_where_1 = `where ${sql_where_1}`;
    if (sql_where_2.length > 0) sql_where_2 = `where ${sql_where_2}`;

    let sql = `
    select
        sum(total) total
      from
        (
        select
          count(pw.*) total
          from
            "pendingWithdraw" pw
          ${sql_where_1}
        union all
          select
            count(w.*) total
          from
            withdraw w
          ${sql_where_2} 
        ) x
    `;

    const totalDatas = await this.sequelize.query(sql, {
      type: QueryTypes.SELECT,
    });

    const total = totalDatas[0]['total'];

    let sql_sorts = '';
    request.sorts.forEach(_ => {
      prefix = sql_sorts.length > 0 ? ',' : '';
      sql_sorts += ` ${prefix} "${_.property}" ${_.direction}`;
    })
    if (sql_sorts.length > 0) sql_sorts = `order by ${sql_sorts}`;

    sql = `
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
        ${sql_where_1}
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
        ${sql_where_2}
      -- order by "date" desc, "userId", "id"
      ${sql_sorts}
      limit ${request.pageSize} offset ${request.page * request.pageSize}`;

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
          clientOrderId: number;
          amount: number;
          providerOrderId: string;
          status: string;
          errorCode: string;
          errorMessage: string;
          paymentProvider: {
            id: number;
            providerName: string;
            isDepositSupport: boolean;
            isWithdrawalSupport: boolean;
            isOnlyCardSupport: boolean;
          };
          paymentProviderBank: {
            id: number;
            bankId: number;
            paymentProviderBankCode: string;
            paymentProviderBankName: string;
          };
          bank: {
            id: number;
            bankName: string;
            bankCode: string;
          };
          bankId: number;
          bankAccountName: string;
          bankAccountNumber: string;
          province: string;
          city: string;
          branch: string;
          currency: string;
          userName: string;
          countryCallingCode: string;
          phoneNumber: string;
        }
        >{};

      order.id = item['id'];
      order.userId = numeral(item['userId']).value();
      order.date = item['date'];
      order.orderId = numeral(item['orderId']).value();
      order.clientOrderId = numeral(item['clientOrderId']).value();
      order.providerOrderId = item['providerOrderId'];
      order.amount = numeral(item['amount']).value();
      order.status = item['status'];
      order.errorCode = item['errorCode'];
      order.errorMessage = item['errorMessage'];
      order.paymentProvider = {
        id: numeral(item['paymentProviderId']).value(),
        providerName: item['providerName'],
        isDepositSupport: JSON.parse(item['isDepositSupport']),
        isWithdrawalSupport: JSON.parse(item['isWithdrawalSupport']),
        isOnlyCardSupport: JSON.parse(item['isOnlyCardSupport']),
      };
      order.paymentProviderBank = {
        id: numeral(item['paymentProviderBankId']).value(),
        paymentProviderBankCode: item['paymentProviderBankCode'],
        paymentProviderBankName: item['paymentProviderBankName'],
        bankId: item['bankId'],
      };
      order.bankId = item['bankId'];
      order.bankAccountName = item['bankAccountName'];
      order.bankAccountNumber = item['bankAccountNumber'];
      order.province = item['province'];
      order.city = item['city'];
      order.branch = item['branch'];
      order.userName = item['usrName'];
      order.countryCallingCode = item['countryCallingCode'];
      order.phoneNumber = item['phoneNumber'];
      order.currency = item['currency'];
      order.bank = {
        id: item['bankId'],
        bankCode: item['bankCode'],
        bankName: item['bankName'],
      };

      orders.push(order);
    });

    return { total, orders };
  }
}
