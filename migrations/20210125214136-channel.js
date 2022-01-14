'use strict';

module.exports = {
  up: async (queryInterface, DataTypes) => {
    /**
     * Add altering commands here.
     */
    return queryInterface.createTable('channel', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        unique: true,
      },

      channelName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      fromPaymentSystemId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'paymentSystem',
          key: 'id',
          as: 'fromPaymentSystemId',
        },
      },

      toPaymentSystemId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'paymentSystem',
          key: 'id',
          as: 'toPaymentSystemId',
        },
      },

      depositOrWithdrawable: {
        type: DataTypes.INTEGER,
      },

      minAmount: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },

      maxAmount: {
        type: DataTypes.DECIMAL,
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
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    //return queryInterface.renameTable('channel', 'drop_channel')
    return queryInterface.dropTable('channel');
  },
};
