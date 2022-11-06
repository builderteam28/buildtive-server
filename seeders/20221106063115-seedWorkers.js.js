"use strict";
const { hash } = require("../helpers/bcrypt");
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
    const workers = require("../data/db.json").workers.map((el) => {
      return {
        email: el.email,
        phoneNumber: el.phoneNumber,
        address: el.address,
        birthDate: el.birthDate,
        idNumber: el.idNumber,
        fullName: el.first_name + ` ` + el.last_name,
        password: hash(el.password),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

    await queryInterface.bulkInsert("Workers", workers);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Workers", null);
  },
};
