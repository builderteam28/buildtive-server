"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    let projectWorkers = require("../data/projectWorkers.json");
    projectWorkers.forEach((el) => {
      el.createdAt = new Date();
      el.updatedAt = new Date();
    });
    await queryInterface.bulkInsert("ProjectWorkers", projectWorkers, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("ProjectWorkers", null, {
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
  },
};
