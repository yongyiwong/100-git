'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     */
    await queryInterface.bulkInsert(
      'paymentProviderChannel',
      [
        {
          id: 1,
          channelId: 1,
          paymentProviderId: 1,
          providerChannelName: 'ALIPAYTOBANK',
          providerMinAmount: 500,
          providerMaxAmount: 20000,
          isActive: false,
          isAvailable: false,
          isMinMaxAuto: false,
        },
        {
          id: 2,
          channelId: 3,
          paymentProviderId: 1,
          providerChannelName: 'BANKTOBANK',
          providerMinAmount: 500,
          providerMaxAmount: 9999,
          isActive: true,
          isAvailable: true,
          isMinMaxAuto: false,
        },
        {
          id: 25,
          channelId: 10,
          paymentProviderId: 1,
          providerChannelName: 'USDT',
          providerMinAmount: 150,
          providerMaxAmount: 60000,
          isActive: true,
          isAvailable: true,
          isMinMaxAuto: false,
        },
        {
          id: 3,
          channelId: 5,
          paymentProviderId: 1,
          providerChannelName: 'BANKTOBANK',
          providerMinAmount: 1000,
          providerMaxAmount: 20000,
          isActive: true,
          isAvailable: true,
          isMinMaxAuto: false,
        },
        {
          id: 4,
          channelId: 1,
          paymentProviderId: 2,
          providerChannelName: 'alipay_cmb',
          providerMinAmount: 300,
          providerMaxAmount: 10000,
          isActive: true,
          isAvailable: false,
          isMinMaxAuto: false,
        },
        {
          id: 5,
          channelId: 2,
          paymentProviderId: 2,
          providerChannelName: 'alipay_cmb',
          providerMinAmount: 300,
          providerMaxAmount: 10000,
          isActive: true,
          isAvailable: false,
          isMinMaxAuto: false,
        },
        {
          id: 6,
          channelId: 3,
          paymentProviderId: 2,
          providerChannelName: 'onlinebank_128',
          providerMinAmount: 50,
          providerMaxAmount: 300,
          isActive: false,
          isAvailable: false,
          isMinMaxAuto: false,
        },
        {
          id: 7,
          channelId: 3,
          paymentProviderId: 2,
          providerChannelName: 'onlinebank_118',
          providerMinAmount: 300,
          providerMaxAmount: 1999,
          isActive: false,
          isAvailable: false,
          isMinMaxAuto: false,
        },
        {
          id: 20,
          channelId: 3,
          paymentProviderId: 2,
          providerChannelName: 'c2c_118',
          providerMinAmount: 300,
          providerMaxAmount: 10000,
          isActive: true,
          isAvailable: true,
          isMinMaxAuto: false,
        },
        {
          id: 8,
          channelId: 1,
          paymentProviderId: 3,
          providerChannelName: 'alipay_card',
          providerMinAmount: 500,
          providerMaxAmount: 10000,
          isActive: true,
          isAvailable: false,
          isMinMaxAuto: false,
        },
        {
          id: 9,
          channelId: 3,
          paymentProviderId: 3,
          providerChannelName: 'bank_transfer',
          providerMinAmount: 500,
          providerMaxAmount: 10000,
          isActive: true,
          isAvailable: false,
          isMinMaxAuto: false,
        },
        {
          id: 10,
          channelId: 4,
          paymentProviderId: 3,
          providerChannelName: 'alipay_gateway',
          providerMinAmount: 500,
          providerMaxAmount: 10000,
          isActive: true,
          isAvailable: false,
          isMinMaxAuto: false,
        },
        {
          id: 11,
          channelId: 5,
          paymentProviderId: 3,
          providerChannelName: 'bank_transfer',
          providerMinAmount: 2000,
          providerMaxAmount: 30000,
          isActive: true,
          isAvailable: true,
          isMinMaxAuto: false,
        },
        {
          id: 12,
          channelId: 6,
          paymentProviderId: 3,
          providerChannelName: 'cloud_quickpass',
          providerMinAmount: 500,
          providerMaxAmount: 10000,
          isActive: true,
          isAvailable: false,
          isMinMaxAuto: false,
        },
        {
          id: 13,
          channelId: 1,
          paymentProviderId: 4,
          providerChannelName: '3',
          providerMinAmount: 300,
          providerMaxAmount: 10000,
          isActive: true,
          isAvailable: false,
          isMinMaxAuto: false,
        },
        {
          id: 14,
          channelId: 5,
          paymentProviderId: 4,
          providerChannelName: 'bank_transfer',
          providerMinAmount: 1000,
          providerMaxAmount: 30000,
          isActive: true,
          isAvailable: true,
          isMinMaxAuto: false,
        },
        // {
        //   channelId: 1,
        //   paymentProviderId: 5,
        //   providerChannelName: 'ALIPAYTOBANK',
        //   providerMinAmount: 500,
        //   providerMaxAmount: 15000,
        //   isAvailable: false,
        // },
        // {
        //   channelId: 5,
        //   paymentProviderId: 5,
        //   providerChannelName: 'bank_transfer',
        //   providerMinAmount: 5000,
        //   providerMaxAmount: 50000,
        //   isAvailable: false,
        // },
        {
          id: 15,
          channelId: 5,
          paymentProviderId: 6,
          providerChannelName: 'bank_transfer',
          providerMinAmount: 10,
          providerMaxAmount: 49998,
          isActive: true,
          isAvailable: true,
          isMinMaxAuto: false,
        },
        {
          id: 16,
          channelId: 7,
          paymentProviderId: 7,
          providerChannelName: '1',
          providerMinAmount: 500,
          providerMaxAmount: 50000,
          isActive: false,
          isAvailable: false,
          isMinMaxAuto: false,
        },
        {
          id: 17,
          channelId: 8,
          paymentProviderId: 7,
          providerChannelName: '2',
          providerMinAmount: 500,
          providerMaxAmount: 50000,
          isActive: false,
          isAvailable: false,
          isMinMaxAuto: false,
        },
        {
          id: 18,
          channelId: 9,
          paymentProviderId: 7,
          providerChannelName: '3',
          providerMinAmount: 500,
          providerMaxAmount: 50000,
          isActive: true,
          isAvailable: true,
          isMinMaxAuto: false,
        },
        {
          id: 19,
          channelId: 5,
          paymentProviderId: 7,
          providerChannelName: '3',
          providerMinAmount: 500,
          providerMaxAmount: 25000,
          isActive: true,
          isAvailable: true,
          isMinMaxAuto: false,
        },
        {
          id: 21,
          channelId: 3,
          paymentProviderId: 8,
          providerChannelName: 'BANKTOBANK',
          providerMinAmount: 0,
          providerMaxAmount: 0,
          isActive: true,
          isAvailable: true,
          isMinMaxAuto: true,
        },
        {
          id: 22,
          channelId: 5,
          paymentProviderId: 8,
          providerChannelName: 'BANKTOBANK',
          providerMinAmount: 500,
          providerMaxAmount: 20000,
          isActive: true,
          isAvailable: true,
          isMinMaxAuto: false,
        },
        {
          id: 23,
          channelId: 3,
          paymentProviderId: 9,
          providerChannelName: 'BANKTOBANK',
          providerMinAmount: 0,
          providerMaxAmount: 0,
          isActive: true,
          isAvailable: true,
          isMinMaxAuto: true,
        },
        {
          id: 24,
          channelId: 5,
          paymentProviderId: 9,
          providerChannelName: 'BANKTOBANK',
          providerMinAmount: 500,
          providerMaxAmount: 20000,
          isActive: true,
          isAvailable: true,
          isMinMaxAuto: false,
        },
        {
          id: 26,
          channelId: 10,
          paymentProviderId: 10,
          providerChannelName: 'USDT',
          providerMinAmount: null,
          providerMaxAmount: 60000,
          isActive: true,
          isAvailable: true,
          isMinMaxAuto: true,
        },
        {
          id: 27,
          channelId: 11,
          paymentProviderId: 10,
          providerChannelName: 'USDT',
          providerMinAmount: null,
          providerMaxAmount: 60000,
          isActive: true,
          isAvailable: true,
          isMinMaxAuto: true,
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
    await queryInterface.bulkDelete('paymentProviderChannel', null, {});
  },
};
