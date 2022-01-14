'use strict';

module.exports = {
  up: async (queryInterface, DataTypes) => {
    /**
     * Add altering commands here.
     */
    return queryInterface.createTable(
      'paymentProviderBank',
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

        paymentProviderBankCode: {
          type: DataTypes.STRING,
          allowNull: false,
        },

        paymentProviderBankName: {
          type: DataTypes.STRING,
          allowNull: false,
        },

        isActive: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
          allowNull: false,
        },

        isAvailable: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
          allowNull: false,
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
      },
      {
        uniqueKeys: [
          {
            name: 'uniquePaymentProviderBank',
            singleField: false,
            fields: ['paymentProviderId', 'bankId'],
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
    //return queryInterface.renameTable('paymentProviderChannel', 'drop_paymentProviderChannel')
    return queryInterface.dropTable('paymentProviderBank');
  },
};
