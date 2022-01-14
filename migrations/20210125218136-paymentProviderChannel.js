'use strict';

module.exports = {
  up: async (queryInterface, DataTypes) => {
    /**
     * Add altering commands here.
     */
    return queryInterface.createTable(
      'paymentProviderChannel',
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
        channelId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'channel',
            key: 'id',
            as: 'channelId',
          },
        },
        providerChannelName: {
          type: DataTypes.STRING,
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
        isFrozen: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
          allowNull: false,
        },
        frozenCheckedDate: {
          allowNull: true,
          defaultValue: null,
          type: DataTypes.DATE,
        },
        isMinMaxAuto: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
          allowNull: false,
        },
        testedAt: {
          allowNull: true,
          type: DataTypes.DATE,
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
            name: 'unique_channel_paymentprovider_1',
            singleField: false,
            fields: ['channelId', 'paymentProviderId', 'providerChannelName'],
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
    return queryInterface.dropTable('paymentProviderChannel');
  },
};
