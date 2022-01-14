'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'options',
      [
        {
          id: 1,
          optName: 'withdrawDefaultMinAmount',
          optValue: '500',
        },
        {
          id: 2,
          optName: 'withdrawDefaultMaxAmount',
          optValue: '50000',
        },
        {
          id: 3,
          optName: 'dailyMaxNumWithdraw',
          optValue: '5',
        },
        {
          id: 4,
          optName: 'dailyMaxAmountWithdraw',
          optValue: '200000',
        },
        {
          id: 5,
          optName: 'huobiExchangeData',
          optValue: '{}',
        },
        {
          id: 6,
          optName: 'euroCupAmount',
          optValue: '51500',
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
