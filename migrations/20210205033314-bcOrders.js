'use strict';

module.exports = {
  up: async (queryInterface, DataTypes) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.createTable(
      'bcOrders',
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
          unique: true
        },
        orderId: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        depositOrWithdrawable: {
          type: DataTypes.INTEGER
        },
        processed: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
          allowNull: false
        },
        status: {
          type: DataTypes.STRING,
          allowNull: false
        },
        logData: {
          type: DataTypes.STRING(2050)
        },
        createdAt: {
          allowNull: false,
          defaultValue: DataTypes.fn('now'),
          type: DataTypes.DATE
        },
        updatedAt: {
          allowNull: false,
          defaultValue: DataTypes.fn('now'),
          type: DataTypes.DATE
        }
      },
      {
        uniqueKeys: [
          {
            name: 'uniquebcOrders',
            singleField: false,
            fields: ['orderId', 'depositOrWithdrawable']
          }
        ]
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
  }
};
