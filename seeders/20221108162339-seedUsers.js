"use strict";
const { hash } = require("../helpers/bcrypt");
module.exports = {
  async up(queryInterface, Sequelize) {
    let users = require("../data/users.json");
    users.forEach((el) => {
      el.password = hash(el.password);
      el.createdAt = new Date();
      el.updatedAt = new Date();
    });
    await queryInterface.bulkInsert("Users", users, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
  },
};
