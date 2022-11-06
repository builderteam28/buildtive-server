"use strict";
const { hash } = require("../helpers/bcrypt");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Worker extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Worker.belongsToMany(models.User, { through: models.Chat });
      Worker.belongsToMany(models.User, { through: models.Rating });
      Worker.belongsToMany(models.Project, { through: models.ProjectWorker });
      Worker.belongsToMany(models.Project, { through: models.Payment });
      Worker.belongsToMany(models.Category, { through: models.WorkerCategory });
    }
  }
  Worker.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: "Email already in use!",
        },
        validate: {
          notEmpty: { msg: "Email is required" },
          notNull: { msg: "Email is required" },
          isEmail: { msg: "Wrong email format" },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Password is required" },
          notNull: { msg: "Password is required" },
        },
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Name is required" },
          notNull: { msg: "Name is required" },
        },
      },
      phoneNumber:{
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "phoneNumber is required" },
          notNull: { msg: "phoneNumber is required" },
        },
      },
      address:{
        type:DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "address is required" },
          notNull: { msg: "address is required" },
        },
      },
      birthDate:{
        type:DataTypes.DATE,
        allowNull: false,
        validate: {
          notEmpty: { msg: "birthDate is required" },
          notNull: { msg: "birthDate is required" },
        },
      }, 
      idNumber:{
        type:DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "idNumber is required" },
          notNull: { msg: "idNumber is required" },
        },
      },
    },
    {
      sequelize,
      modelName: "Worker",
    }
  );
  Worker.beforeCreate((instance, options) => {
    instance.password = hash(instance.password);
  });
  return Worker;
};
