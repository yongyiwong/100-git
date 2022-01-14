'use strict';

module.exports = {
  up: async (queryInterface, DataTypes) => {
    /**
     * Add altering commands here.
     */
    return queryInterface.createTable(
      'bcToKSportTeam',
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,          
          unique: true
        },

        bcTeamId: {
          type: DataTypes.STRING,
          allowNull: false,
        },

        bcTeamName: {
          type: DataTypes.STRING,
          allowNull: false,
        },

        KSportTeamId: {
          type: DataTypes.STRING,
          allowNull: false,
        },

        KSportTeamName: {
          type: DataTypes.STRING,
          allowNull: false,
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
            name: "unique1",
            singleField: false,
            fields: ['bcTeamId', 'bcTeamName']
          },
          {
            name: "unique2",
            singleField: false,
            fields: ['KSportTeamId', 'KSportTeamName']
          }
        ]
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
    //return queryInterface.renameTable('betToKSportTeam', 'drop_betToKSportTeam')
    return queryInterface.dropTable('bcToKSportTeam');
  }
};
