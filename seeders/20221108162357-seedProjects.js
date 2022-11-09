"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    let projects = require("../data/projects.json");
    projects.forEach((el) => {
      el.createdAt = new Date();
      el.updatedAt = new Date();
    });
    await queryInterface.bulkInsert("Projects", projects, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Projects", null, {
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
  },
};
