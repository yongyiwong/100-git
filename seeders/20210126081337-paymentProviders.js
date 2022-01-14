'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     */
    await queryInterface.bulkInsert(
      'paymentProviders',
      [
        {
          id: 1,
          providerName: 'MSZF',
          isDepositSupport: true,
          isWithdrawalSupport: true,
          isOnlyCardSupport: false,
          needsDepositPhoneNumber: false,
          needsWithdrawPhoneNumber: false,
          needsDepositBankCode: false,
        },
        {
          id: 2,
          providerName: 'D1F',
          isDepositSupport: true,
          isWithdrawalSupport: false,
          isOnlyCardSupport: false,
          needsDepositPhoneNumber: false,
          needsWithdrawPhoneNumber: false,
          needsDepositBankCode: true,
        },
        {
          id: 3,
          providerName: 'XINGCHEN',
          isDepositSupport: true,
          isWithdrawalSupport: true,
          isOnlyCardSupport: false,
          needsDepositPhoneNumber: false,
          needsWithdrawPhoneNumber: false,
          needsDepositBankCode: false,
        },
        {
          id: 4,
          providerName: 'UZPAY',
          isDepositSupport: true,
          isWithdrawalSupport: true,
          isOnlyCardSupport: false,
          needsDepositPhoneNumber: false,
          needsWithdrawPhoneNumber: false,
          needsDepositBankCode: false,
        },
        {
          id: 5,
          providerName: 'SDD',
          isDepositSupport: false,
          isWithdrawalSupport: false,
          isOnlyCardSupport: false,
          needsDepositPhoneNumber: false,
          needsWithdrawPhoneNumber: false,
          needsDepositBankCode: false,
        },
        {
          id: 6,
          providerName: 'HENGXIN',
          isDepositSupport: false,
          isWithdrawalSupport: true,
          isOnlyCardSupport: false,
          needsDepositPhoneNumber: false,
          needsWithdrawPhoneNumber: false,
          needsDepositBankCode: false,
        },
        {
          id: 7,
          providerName: 'JBP',
          isDepositSupport: true,
          isWithdrawalSupport: true,
          isOnlyCardSupport: false,
          needsDepositPhoneNumber: true,
          needsWithdrawPhoneNumber: true,
          needsDepositBankCode: false,
        },
        {
          id: 8,
          providerName: 'SXC',
          isDepositSupport: true,
          isWithdrawalSupport: true,
          isOnlyCardSupport: true,
          needsDepositPhoneNumber: true,
          needsWithdrawPhoneNumber: true,
          needsDepositBankCode: false,
        },
        {
          id: 9,
          providerName: 'DBPay',
          isDepositSupport: true,
          isWithdrawalSupport: true,
          isOnlyCardSupport: true,
          needsDepositPhoneNumber: true,
          needsWithdrawPhoneNumber: true,
          needsDepositBankCode: false,
        },
        {
          id: 10,
          providerName: 'BISA',
          isDepositSupport: true,
          isWithdrawalSupport: true,
          isOnlyCardSupport: false,
          needsDepositPhoneNumber: false,
          needsWithdrawPhoneNumber: false,
          needsDepositBankCode: false,
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
     */
    await queryInterface.bulkDelete('paymentProviders', null, {});
  },
};
