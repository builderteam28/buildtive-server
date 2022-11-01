'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Ratings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      value: {
        type: Sequelize.INTEGER,
        allowNull : false
      },
      UserId: {
        type: Sequelize.INTEGER,
        references : {
          model: "Users",
          key: "id"
        }
      },
      WorkerId: {
        type: Sequelize.INTEGER,
        references : {
          model : "Workers",
          key: "id"
        }
      },
      ProjectId: {
        type: Sequelize.INTEGER,
        references : {
          model: "Projects",
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
    await queryInterface.dropTable('Ratings');
  }
};