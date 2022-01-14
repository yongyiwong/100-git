'use strict';

module.exports = {
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable('pendingWithdraw', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        unique: true,
      },
      orderId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      clientOrderId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      providerOrderId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      paymentProviderId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'paymentProviders',
          key: 'id',
          as: 'paymentProviderId',
        },
      },
      currency: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      bankId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'bank',
          key: 'id',
          as: 'bankId',
        },
      },
      bankAccountName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      bankAccountNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      province: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      branch: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      userName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      countryCallingCode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      hashcode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      errorCode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      errorMessage: {
        type: DataTypes.STRING,
        allowNull: true,
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
    //return queryInterface.renameTable('pendingWithdraw', 'drop_pendingWithdraw')
    return queryInterface.dropTable('pendingWithdraw');
  },
};
