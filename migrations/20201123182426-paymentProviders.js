'use strict';

module.exports = {
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable('paymentProviders', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        unique: true,
      },
      providerName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      isDepositSupport: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
        unique: false,
      },
      isWithdrawalSupport: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
        unique: false,
      },
      isOnlyCardSupport: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
        unique: false,
      },
      needsDepositPhoneNumber: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
        unique: false,
      },
      needsWithdrawPhoneNumber: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
        unique: false,
      },
      needsDepositBankCode: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
        unique: false,
      },
      createdAt: {
        allowNull: false,
        defaultValue: DataTypes.fn('now'),
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        defaultValue: DataTypes.fn('now'),
        type: DataTypes.DATE,
      },
    });
  },

  down: async (queryInterface) => {
    //return queryInterface.renameTable('paymentProviders', 'drop_paymentProviders')
    return queryInterface.dropTable('paymentProviders');
  },
};
