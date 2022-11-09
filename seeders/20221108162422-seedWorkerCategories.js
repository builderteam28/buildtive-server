"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    let workerCategories = require("../data/workerCategories.json");
    workerCategories.forEach((el) => {
      el.createdAt = new Date();
      el.updatedAt = new Date();
    });
    await queryInterface.bulkInsert("WorkerCategories", workerCategories, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("WorkerCategories", null, {
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
  },
};
