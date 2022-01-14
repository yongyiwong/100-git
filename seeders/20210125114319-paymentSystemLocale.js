'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     */
    await queryInterface.bulkInsert(
      'paymentSystemLocale',
      [
        {
          id: 1,
          paymentSystemId: 1,
          localeId: 1,
          label: 'Alipay',
        },
        {
          id: 2,
          paymentSystemId: 1,
          localeId: 2,
          label: '支付宝',
        },
        {
          id: 3,
          paymentSystemId: 2,
          localeId: 1,
          label: 'WeChat',
        },
        {
          id: 4,
          paymentSystemId: 2,
          localeId: 2,
          label: '微信',
        },
        {
          id: 5,
          paymentSystemId: 3,
          localeId: 1,
          label: 'Bank card',
        },
        {
          id: 6,
          paymentSystemId: 3,
          localeId: 2,
          label: '银行卡',
        },
        {
          id: 7,
          paymentSystemId: 4,
          localeId: 1,
          label: 'UNIONPAYAPP',
        },
        {
          id: 8,
          paymentSystemId: 4,
          localeId: 2,
          label: '云闪付',
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
  },
};
