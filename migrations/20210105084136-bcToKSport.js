'use strict';

module.exports = {
  up: async (queryInterface, DataTypes) => {
    /**
     * Add altering commands here.
     */
    return queryInterface.createTable(
      'bcToKSport',
      {
        id: {
          type: DataTypes.STRING(1024),
          allowNull: false,
          primaryKey: true,
          unique: true,
        },
        sportType: {
          type: DataTypes.STRING,
          allowNull: false,
        },

        bcEventId: {
          type: DataTypes.STRING,
          allowNull: false,
        },

        kSportEventId: {
          type: DataTypes.STRING,
          allowNull: false,
        },

        matchScore: {
          type: DataTypes.DECIMAL,
          allowNull: false,
        },

        correct: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },

        isManual: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },

        isKilled: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },

        streamState: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },

        isStreamCn: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },

        isStreamHd: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },

        bcEventTime: {
          type: DataTypes.DATE,
          allowNull: false,
        },

        bcTeamId1: {
          type: DataTypes.STRING,
          allowNull: false,
        },

        bcTeamId2: {
          type: DataTypes.STRING,
          allowNull: true,
        },

        bcTeamName1: {
          type: DataTypes.STRING,
          allowNull: false,
        },

        bcTeamName2: {
          type: DataTypes.STRING,
          allowNull: true,
        },

        //////////////////////////////////////////////////////////////////////////
        // KSport Event Information
        //////////////////////////////////////////////////////////////////////////

        kSportEventTime: {
          type: DataTypes.DATE,
          allowNull: false,
        },

        kSportTeamId1: {
          type: DataTypes.STRING,
          allowNull: false,
        },

        kSportTeamId2: {
          type: DataTypes.STRING,
          allowNull: true,
        },

        kSportTeamName1: {
          type: DataTypes.STRING,
          allowNull: false,
        },

        kSportTeamName2: {
          type: DataTypes.STRING,
          allowNull: true,
        },

        kSportStreamId: {
          type: DataTypes.STRING,
          allowNull: true,
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
            name: 'uniqueEventMatch',
            singleField: false,
            fields: ['bcEventId', 'kSportEventId'],
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
    //return queryInterface.renameTable('betToKSportTeam', 'drop_betToKSportTeam')
    return queryInterface.dropTable('bcToKSport');
  },
};
