"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    let workerCategories = [];
    for (let i = 0; i < 30; i++) {
      const WorkerId = i + 1;
      const CategoryId = Math.ceil(Math.random() * 6);
      const createdAt = new Date();
      const updatedAt = new Date();
      workerCategories.push({ WorkerId, CategoryId, createdAt, updatedAt });
    }
    await queryInterface.bulkInsert("WorkerCategories", workerCategories);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("WorkerCategories", null);
  },
};
