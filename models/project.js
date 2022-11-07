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
      Project.belongsTo(models.Category);
      Project.hasOne(models.Payment);
      Project.belongsToMany(models.Worker, { through: models.ProjectWorker });
      Project.belongsToMany(models.Worker, { through: models.Rating });
      Project.belongsTo(models.User);
    }
  }
  Project.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: `Project name can't be empty`,
          },
          notEmpty: {
            msg: `Project name can't be empty`,
          },
        },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: `Project description can't be empty`,
          },
          notEmpty: {
            msg: `Project description can't be empty`,
          },
        },
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: `Project address can't be empty`,
          },
          notEmpty: {
            msg: `Project address can't be empty`,
          },
        },
      },
      tenor: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: `Project tenor can't be empty`,
          },
          notEmpty: {
            msg: `Project tenor can't be empty`,
          },
        },
      },
      totalWorker: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: `Total Worker can't be empty`,
          },
          notEmpty: {
            msg: `Total Worker can't be empty`,
          },
        },
      },
      cost: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: `Cost project can't be empty`,
          },
          notEmpty: {
            msg: `Cost project can't be empty`,
          },
        },
      },
      status: DataTypes.STRING,
      long: {
        type: DataTypes.FLOAT(12),
        allowNull: false,
        validate: {
          notNull: {
            msg: `Project location can't be empty`,
          },
          notEmpty: {
            msg: `Project location can't be empty`,
          },
        },
      },
      lat: {
        type: DataTypes.FLOAT(12),
        allowNull: false,
        validate: {
          notNull: {
            msg: `Project location can't be empty`,
          },
          notEmpty: {
            msg: `Project location can't be empty`,
          },
        },
      },
      UserId: DataTypes.INTEGER,
      CategoryId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Project",
    }
  );
  Project.beforeCreate((project, opt) => {
    project.status = "inactive";
  });
  return Project;
};
