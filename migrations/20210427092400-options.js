'use strict';

module.exports = {
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      'options',
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
          unique: true,
        },
        optName: {
          type: DataTypes.STRING,
          allowNull: false,
          defautValue: '',
        },
        optValue: {
          type: DataTypes.BLOB,
          allowNull: false,
          defautValue: '',
        },
      },
      {
        uniqueKeys: [
          {
            name: 'unique_optName_options',
            singleField: false,
            fields: ['optName'],
          },
        ],
      }
    );
  },

  down: async (queryInterface) => {
    return queryInterface.dropTable('options');
  },
};
