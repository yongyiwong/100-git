'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'channelLocale',
      [
        {
          id: 1,
          channelId: 1,
          localeId: 1,
          label: 'ALIPAYTOBANK(D)',
        },
        {
          id: 2,
          channelId: 1,
          localeId: 2,
          label: '支转卡(D)',
        },
        {
          id: 3,
          channelId: 2,
          localeId: 1,
          label: 'WECHATTOBANK(D)',
        },
        {
          id: 4,
          channelId: 2,
          localeId: 2,
          label: '微信转卡(D)',
        },
        {
          id: 5,
          channelId: 3,
          localeId: 1,
          label: 'BANKTOBANK(D)',
        },
        {
          id: 6,
          channelId: 3,
          localeId: 2,
          label: '卡转卡(D)',
        },
        {
          id: 7,
          channelId: 4,
          localeId: 1,
          label: 'BANKTOALIPAY(D)',
        },
        {
          id: 8,
          channelId: 4,
          localeId: 2,
          label: '卡转支付宝(D)',
        },
        {
          id: 9,
          channelId: 5,
          localeId: 1,
          label: 'BANKTOBANK(W)',
        },
        {
          id: 10,
          channelId: 5,
          localeId: 2,
          label: '卡转卡(W)',
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
