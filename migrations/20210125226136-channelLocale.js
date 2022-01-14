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
      'channelLocale',
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
          unique: true,
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
        localeId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'locale',
            key: 'id',
            as: 'localeId',
          },
        },
        label: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        uniqueKeys: [
          {
            name: 'uniqueChannelLocale',
            singleField: false,
            fields: ['channelId', 'localeId'],
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
  },
};
