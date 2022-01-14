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
      'paymentSystemLocale',
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
          unique: true
        },
        paymentSystemId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'paymentSystem',
            key: 'id',
            as: 'paymentSystemId'
          }
        },
        localeId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'locale',
            key: 'id',
            as: 'localeId'
          }
        },
        label: {
          type: DataTypes.STRING,
          allowNull: false
        }
      },
      {
        uniqueKeys: [
          {
            name: 'uniqueChannelLocale',
            singleField: false,
            fields: ['paymentSystemId', 'localeId']
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
