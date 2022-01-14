module.exports = {
  up: function (queryInterface, DataTypes) {
    return queryInterface.sequelize.query(
      `create view "v_paymentProvider" as 
        select 
                pp.id , pp."providerName" , pp."isDepositSupport" , pp."isWithdrawalSupport", 
                pp."isOnlyCardSupport",
                min( case when pp."isDepositSupport" and c."depositOrWithdrawable" = 1 then ppc."providerMinAmount"  end) "depositMinAmount",
                max( case when pp."isDepositSupport" and c."depositOrWithdrawable" = 1 then ppc."providerMaxAmount" end) "depositMaxAmount",
                min( case when pp."isWithdrawalSupport" and c."depositOrWithdrawable" = 2 then ppc."providerMinAmount"  end) "withdrawMinAmount",
                max( case when pp."isWithdrawalSupport" and c."depositOrWithdrawable" = 2 then ppc."providerMaxAmount" end) "withdrawMaxAmount"
            from "paymentProviders" pp 
            left join "paymentProviderChannel" ppc on pp.id = ppc."paymentProviderId" 
            left join channel c on ppc."channelId"  = c.id
            group by pp.id `
    );
  },
  down: function (queryInterface, DataTypes) {
    return queryInterface.sequelize.query(`DROP VIEW "v_paymentProvider"`);
  },
};
