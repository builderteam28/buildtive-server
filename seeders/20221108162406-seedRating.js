"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    let ratings = require("../data/ratings.json");
    ratings.forEach((el) => {
      el.createdAt = new Date();
      el.updatedAt = new Date();
    });
    await queryInterface.bulkInsert("Ratings", ratings, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Ratings", null, {
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
  },
};
