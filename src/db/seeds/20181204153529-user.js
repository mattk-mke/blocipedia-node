'use strict';

const faker = require("faker");
const bcrypt = require("bcryptjs");

let users = [];
for (let i = 1; i <= 15; i++) {
  const salt = bcrypt.genSaltSync();
  const hashedPassword = bcrypt.hashSync(faker.internet.password(), salt);
  users.push({
    name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    email: faker.internet.exampleEmail(),
    password: hashedPassword,
    role: i%2 == 0 ? "standard" : "premium",
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
    return queryInterface.bulkInsert("Users", users, {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
    return queryInterface.bulkDelete("Users", null, {truncate: true, cascade: true, restartIdentity: true});
  }
};
