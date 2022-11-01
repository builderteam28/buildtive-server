'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Payments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull : false
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: "Unpaid"
      },
      ProjectId: {
        type: Sequelize.INTEGER,
        references : {
          model: "Projects",
          key: "id"
        }
      },
      WorkerId: {
        type: Sequelize.INTEGER,
        references : {
          model: "Workers",
          key: "id"
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Payments');
  }
};