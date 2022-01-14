'use strict';

module.exports = {
  up: async (queryInterface, DataTypes) => {
    /**
     * Add altering commands here.
     */
    return queryInterface.createTable(
      'paymentProviderUsdtProtocol',
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
        usdtProtoId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'usdtProtocol',
            key: 'id',
            as: 'usdtProtoId',
          },
        },
        depositOrWithdrawable: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        providerMinAmount: {
          type: DataTypes.DECIMAL,
          allowNull: true,
        },
        providerMaxAmount: {
          type: DataTypes.DECIMAL,
          allowNull: true,
        },
        providerUsdtProtoName: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        providerUsdtProtoCurrency: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        isAvailable: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
          allowNull: false,
        },
      },
      {
        uniqueKeys: [
          {
            name: 'unique_usdtproto_paymentprovider_1',
            singleField: false,
            fields: [
              'paymentProviderId',
              'usdtProtoId',
              'depositOrWithdrawable',
            ],
          },
        ],
      }
    );
  },
  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.dropTable('usdtProtocols');
  },
};
