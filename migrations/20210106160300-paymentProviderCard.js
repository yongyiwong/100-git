'use strict';

module.exports = {
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      'paymentProviderCard',
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
          unique: true,
        },
        paymentProviderId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'paymentProviders',
            key: 'id',
            as: 'paymentProviderId',
          },
        },
        bankId: {
          type: DataTypes.INTEGER,
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
        maxDailyAmount: {
          type: DataTypes.DECIMAL,
          allowNull: true,
        },
        minAmount: {
          type: DataTypes.DECIMAL,
          allowNull: false,
        },
        maxAmount: {
          type: DataTypes.DECIMAL,
          allowNull: true,
        },
        active: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
          allowNull: false,
        },
      },
      {
        uniqueKeys: [
          {
            name: 'unique_paymentprovider_card_1',
            singleField: false,
            fields: ['paymentProviderId', 'bankAccountNumber'],
          },
        ],
      }
    );
  },

  down: async (queryInterface) => {
    return queryInterface.dropTable('options');
  },
};
