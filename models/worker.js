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
      Worker.belongsToMany(models.Category, { through: models.WorkerCategory });
    }
  }
  Worker.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "Email already registered",
        },
        validate: {
          isEmail: {
            msg: "Invalid Email Format",
          },
          notEmpty: {
            msg: "Email Required",
          },
          notNull: {
            msg: "Email Required",
          },
        },
      },
      password: DataTypes.STRING,
      fullName: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      address: DataTypes.STRING,
      birthDate: DataTypes.DATE,
      idNumber: DataTypes.STRING,
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
