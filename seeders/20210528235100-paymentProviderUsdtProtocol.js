'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     */
    await queryInterface.bulkInsert(
      'paymentProviderUsdtProtocol',
      [
        {
          id: 1,
          paymentProviderId: 1,
          usdtProtoId: 1,
          depositOrWithdrawable: 1,
          providerUsdtProtoName: null,
          providerUsdtProtoCurrency: 'USX',
          providerMinAmount: null,
          providerMaxAmount: null,
          isAvailable: true,
        },
        {
          id: 2,
          paymentProviderId: 1,
          usdtProtoId: 2,
          depositOrWithdrawable: 1,
          providerUsdtProtoName: null,
          providerUsdtProtoCurrency: 'USE',
          providerMinAmount: null,
          providerMaxAmount: null,
          isAvailable: true,
        },
        {
          id: 3,
          paymentProviderId: 10,
          usdtProtoId: 1,
          depositOrWithdrawable: 1,
          providerUsdtProtoName: null,
          providerUsdtProtoCurrency: 'usdt@trc20',
          providerMinAmount: 80,
          providerMaxAmount: null,
          isAvailable: true,
        },
        {
          id: 4,
          paymentProviderId: 10,
          usdtProtoId: 2,
          depositOrWithdrawable: 1,
          providerUsdtProtoName: null,
          providerUsdtProtoCurrency: 'usdt@erc20',
          providerMinAmount: 150,
          providerMaxAmount: null,
          isAvailable: true,
        },
        {
          id: 5,
          paymentProviderId: 10,
          usdtProtoId: 1,
          depositOrWithdrawable: 2,
          providerUsdtProtoName: null,
          providerUsdtProtoCurrency: 'usdt@trc20',
          providerMinAmount: 900,
          providerMaxAmount: null,
          isAvailable: true,
        },
        {
          id: 6,
          paymentProviderId: 10,
          usdtProtoId: 2,
          depositOrWithdrawable: 2,
          providerUsdtProtoName: null,
          providerUsdtProtoCurrency: 'usdt@erc20',
          providerMinAmount: 1800,
          providerMaxAmount: null,
          isAvailable: true,
        },
      ],
      {
        ignoreDuplicates: true,
      }
    );
  },
  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete(
      'usdtPpaymentProviderUsdtProtocolrotocol',
      null,
      {}
    );
  },
};
