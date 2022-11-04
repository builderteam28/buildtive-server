"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Project.hasOne(models.Category);
      Project.belongsToMany(models.Worker, { through: models.Payment });
      Project.belongsToMany(models.Worker, { through: models.ProjectWorker });
      Project.belongsToMany(models.Worker, { through: models.Rating });
      Project.belongsTo(models.User);
    }
  }
  Project.init(
    {
      name: DataTypes.STRING,
      workHours: DataTypes.INTEGER,
      totalWorker: DataTypes.INTEGER,
      cost: DataTypes.INTEGER,
      status: DataTypes.STRING,
      long: DataTypes.FLOAT(12),
      lat: DataTypes.FLOAT(12),
      UserId: DataTypes.INTEGER,
      CategoryId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Project",
    }
  );
  Project.beforeCreate((project, opt) => {
    project.status = "Active";
  });
  return Project;
};
