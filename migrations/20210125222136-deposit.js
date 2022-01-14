'use strict';

module.exports = {
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable('deposit', {
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
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      usdtExchangeRate: {
        type: DataTypes.DECIMAL,
        allowNull: true,
      },
      paymentProviderCardId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'paymentProviderCard',
          key: 'id',
          as: 'paymentProviderCardId',
        },
      },
      userName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      last4Digit: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      providerOrderId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      channelId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'channel',
          key: 'id',
          as: 'channelId',
        },
      },
      paymentProviderId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'paymentProviders',
          key: 'id',
          as: 'paymentProviderId',
        },
      },
      paymentProviderChannelId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'paymentProviderChannel',
          key: 'id',
          as: 'paymentProviderChannelId',
        },
      },
      status: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: false,
      },
      errorCode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      errorMessage: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      hash: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
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
    //return queryInterface.renameTable('deposit', 'drop_deposit')
    return queryInterface.dropTable('deposit');
  },
};
