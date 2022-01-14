'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     */
    await queryInterface.bulkInsert(
      'channel',
      [
        {
          id: 1,
          channelName: 'Alipay-Bank-D',
          fromPaymentSystemId: 1,
          toPaymentSystemId: 3,
          depositOrWithdrawable: 1,
          minAmount: 500,
          maxAmount: 20000,
        },
        {
          id: 2,
          channelName: 'WeChat-Bank-D',
          fromPaymentSystemId: 2,
          toPaymentSystemId: 3,
          depositOrWithdrawable: 1,
          minAmount: 200,
          maxAmount: 40000,
        },
        {
          id: 3,
          channelName: 'Bank-Bank-D',
          fromPaymentSystemId: 3,
          toPaymentSystemId: 3,
          depositOrWithdrawable: 1,
          minAmount: 200,
          maxAmount: 40000,
        },
        {
          id: 4,
          channelName: 'Bank-Alipay-D',
          fromPaymentSystemId: 3,
          toPaymentSystemId: 1,
          depositOrWithdrawable: 1,
          minAmount: 200,
          maxAmount: 40000,
        },
        {
          id: 5,
          channelName: 'Bank-Bank-W',
          fromPaymentSystemId: 3,
          toPaymentSystemId: 3,
          depositOrWithdrawable: 2,
          minAmount: 200,
          maxAmount: 40000,
        },
        {
          id: 6,
          channelName: 'UNIONPAYAPP-Bank-D',
          fromPaymentSystemId: 4,
          toPaymentSystemId: 3,
          depositOrWithdrawable: 1,
          minAmount: 500,
          maxAmount: 10000,
        },
        {
          id: 7,
          channelName: 'Wechat-USDT-D',
          fromPaymentSystemId: 2,
          toPaymentSystemId: 5,
          depositOrWithdrawable: 1,
          minAmount: 500,
          maxAmount: 10000,
        },
        {
          id: 8,
          channelName: 'Alipay-USDT-D',
          fromPaymentSystemId: 1,
          toPaymentSystemId: 5,
          depositOrWithdrawable: 1,
          minAmount: 500,
          maxAmount: 10000,
        },
        {
          id: 9,
          channelName: 'Bank-USDT-D',
          fromPaymentSystemId: 3,
          toPaymentSystemId: 5,
          depositOrWithdrawable: 1,
          minAmount: 500,
          maxAmount: 10000,
        },
        {
          id: 10,
          channelName: 'USDT-USDT-D',
          fromPaymentSystemId: 5,
          toPaymentSystemId: 5,
          depositOrWithdrawable: 1,
          minAmount: 500,
          maxAmount: 10000,
        },
        {
          id: 11,
          channelName: 'USDT-USDT-W',
          fromPaymentSystemId: 5,
          toPaymentSystemId: 5,
          depositOrWithdrawable: 2,
          minAmount: 500,
          maxAmount: 10000,
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
    await queryInterface.bulkDelete('channel', null, {});
  },
};
