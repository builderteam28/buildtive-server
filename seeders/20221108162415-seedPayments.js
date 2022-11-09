'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    let payments = require("../data/payments.json");
    payments.forEach((el) => {
      el.createdAt = new Date();
      el.updatedAt = new Date();
    });
    await queryInterface.bulkInsert("Payments", payments, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Payments", null, {
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
  }
};
