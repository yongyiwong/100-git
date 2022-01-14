'use strict';

module.exports = {
  up: async (queryInterface, DataTypes) => {
    /**
     * Add altering commands here.
     */
    return queryInterface.createTable('bank', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        unique: true
      },

      bankCode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },

      bankName: {
        type: DataTypes.STRING,
        allowNull: false
      },

      isAvailable: {
        type: DataTypes.BOOLEAN,
        allowNull: false
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
    return queryInterface.dropTable('bank');
  }
};
