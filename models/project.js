'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Project.init({
    name: DataTypes.STRING,
    workHours: DataTypes.INTEGER,
    totalWorker: DataTypes.INTEGER,
    cost: DataTypes.INTEGER,
    status: DataTypes.STRING,
    long: DataTypes.FLOAT(12),
    lat: DataTypes.FLOAT(12),
    UserId: DataTypes.INTEGER,
    CategoryId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Project',
  });
  return Project;
};