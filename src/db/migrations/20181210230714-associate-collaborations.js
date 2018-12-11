'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    // User belongsToMany Wiki
    return queryInterface.createTable(
      'collaborations',
      {
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        wikiId: {
          type: Sequelize.INTEGER,
          primaryKey: true,
        },
        userId: {
          type: Sequelize.INTEGER,
          primaryKey: true,
        }
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('collaborations');
  }
};
