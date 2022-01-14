'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     */
    await queryInterface.bulkInsert(
      'usdtProtocol',
      [
        {
          id: 1,
          usdtProtoName: 'TRC20',
        },
        {
          id: 2,
          usdtProtoName: 'ERC20',
        },
        {
          id: 3,
          usdtProtoName: 'OMNI',
        },
        {
          id: 4,
          usdtProtoName: 'BEP2',
        },
        {
          id: 5,
          usdtProtoName: 'EOS',
        },
        {
          id: 6,
          usdtProtoName: 'Algorand',
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
    await queryInterface.bulkDelete('usdtProtocol', null, {});
  },
};
