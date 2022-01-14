'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     */
    await queryInterface.bulkInsert(
      'paymentSystem',
      [
        {
          id: 1,
          paymentSystemName: 'ALIPAY',
          isBank: false,
        },
        {
          id: 2,
          paymentSystemName: 'WECHAT',
          isBank: false,
        },
        {
          id: 3,
          paymentSystemName: 'BANK',
          isBank: true,
        },
        {
          id: 4,
          paymentSystemName: 'UNIONPAYAPP',
          isBank: false,
        },
        {
          id: 5,
          paymentSystemName: 'USDT',
          isBank: false,
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
