'use strict';

module.exports = {
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      'banners',
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
          unique: true
        },
        type: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: false
        },
        banner: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: false
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false
        },
        order: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        url: {
          type: DataTypes.STRING,
          allowNull: false
        },
        buttonText: {
          type: DataTypes.STRING,
          allowNull: false
        },
        buttonColor: {
          type: DataTypes.STRING,
          allowNull: true
        },
        positionX: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        positionY: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        enabled: {
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
      }
    )
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
