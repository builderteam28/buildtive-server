"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProjectWorker extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ProjectWorker.belongsTo(models.Project);
      ProjectWorker.belongsTo(models.Worker);
    }
  }
  ProjectWorker.init(
    {
      status: DataTypes.STRING,
      ProjectId: DataTypes.INTEGER,
      WorkerId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "ProjectWorker",
    }
  );
  ProjectWorker.beforeCreate((app, opt) => {
    app.status = "appliance"
  })
  return ProjectWorker;
};
