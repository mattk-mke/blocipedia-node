'use strict';

const faker = require("faker");

let wikis = [];
for (let i = 1; i <= 10; i++) {
  let id = Math.floor(Math.random() * 15) + 1;
  wikis.push({
    title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
    body: faker.hacker.phrase(),
    private: i%2 == 0,
    userId: Math.floor(Math.random() * 15) + 1,
    createdAt: new Date(),
    updatedAt: new Date()
  });
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    return queryInterface.bulkInsert("Wikis", wikis, {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  
    return queryInterface.bulkDelete("Wikis", null, {truncate: true, cascade: true, restartIdentity: true});
  }
};
