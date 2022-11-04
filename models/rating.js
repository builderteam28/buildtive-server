"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Rating extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Rating.belongsTo(models.User);
      Rating.belongsTo(models.Worker);
    }
  }
  Rating.init(
    {
      value: DataTypes.INTEGER,
      UserId: DataTypes.INTEGER,
      WorkerId: DataTypes.INTEGER,
      ProjectId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Rating",
    }
  );
  return Rating;
};
