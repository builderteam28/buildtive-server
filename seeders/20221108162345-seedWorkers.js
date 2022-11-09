"use strict";
const { hash } = require("../helpers/bcrypt");
module.exports = {
  async up(queryInterface, Sequelize) {
    let workers = require("../data/workers.json");
    workers.forEach((el) => {
      el.password = hash(el.password);
      el.fullName = el.first_name + ` ` + el.last_name;
      el.createdAt = new Date();
      el.updatedAt = new Date();
      delete el.first_name;
      delete el.last_name;
    });
    await queryInterface.bulkInsert("Workers", workers, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Workers", null, {
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
  },
};
