"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    let categories = require("../data/categories.json");
    categories.forEach((el) => {
      el.createdAt = new Date();
      el.updatedAt = new Date();
    });
    await queryInterface.bulkInsert("Categories", categories, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("categories", null, {
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
  },
};
