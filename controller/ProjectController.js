const { Op } = require("sequelize");
const {
  Project,
  Worker,
  Payment,
  Rating,
  Category,
  ProjectWorker,
  WorkerCategory,
  User,
  sequelize,
  Sequelize,
} = require("../models");
class ProjectController {
  static fetchAll(req, res, next) {
    const UserId = req.user.id;
    Project.findAll({
      where: { UserId },
      include: [
        {
          model: User,
          attributes: ["email", "fullName"],
        },
        {
          model: Payment,
        },
        {
          model: Category,
          attributes: ["name"],
        },
        {
          model: ProjectWorker,
          attributes: ["status", "ProjectId", "WorkerId"],
          include: {
            model: Worker,
            attributes: ["fullName"],
          },
        },
      ],
    }).then((projects) => {
      res.status(200).json(projects);
    });
  }
  static async fetchAllProjectWorker(req, res, next) {
    try {
      const result = await Project.findAll({
        where: {
          status: "Inactive",
        },
        include: [
          {
            model: Category,
          },
          {
            model: ProjectWorker,
          },
        ],
      });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
  static async getOne(req, res, next) {
    try {
      const { id } = req.params;
      const project = await Project.findOne({
        where: { id },
        include: [
          {
            model: Category,
            include: {
              model: WorkerCategory,
              include: { model: Worker, attributes: { exclude: ["password"] } },
            },
          },
        ],
      });

      if (!project) throw { name: "ProjectNotFound" };
      res.status(200).json(project);
    } catch (error) {
      next(error);
    }
  }
  static async postProject(req, res, next) {
    try {
      const {
        name,
        tenor,
        totalWorker,
        cost,
        UserId,
        CategoryId,
        long,
        lat,
        address,
        description,
      } = req.body;

      const createdProject = await Project.create({
        name,
        tenor,
        totalWorker,
        cost,
        UserId,
        CategoryId,
        long,
        lat,
        address,
        description,
      });

      res
        .status(201)
        .json({ message: `success add project ${createdProject.name}` });
    } catch (error) {
      next(error);
    }
  }
  static async editProject(req, res, next) {
    try {
      const { id } = req.params;
      const find = await Project.findByPk(id);
      const projects = await Project.findAll();
      if (!find) throw { name: "ProjectNotFound" };
      const { name, tenor, totalWorker, cost, status } = req.body;
      const result = await Project.update(
        { name, tenor, totalWorker, cost, status },
        { where: { id } }
      );
      res.status(200).json({ message: "Project already updated" });
    } catch (error) {
      next(error);
    }
  }
  static async deleteProject(req, res, next) {
    try {
      const { id } = req.params;
      const find = await Project.findByPk(id);
      if (!find) throw { name: "ProjectNotFound" };
      if (find.status == "Active") {
        throw { name: "ProjectIsActive" };
      }
      await Project.destroy({ where: { id } });
      res.status(200).json({ message: "Deleted Project" });
    } catch (error) {
      next(error);
    }
  }
  static async acceptWorker(req, res, next) {
    try {
      const { workerId: WorkerId } = req.params;
      const { ProjectId } = req.body;
      const project = await Project.findByPk(ProjectId);
      if (project.status === "Active") throw { name: "ProjectIsActive" };
      const get = await ProjectWorker.findAll({ where: { ProjectId } });
      if (get.length === project.totalWorker) {
        await Project.update(
          { status: "Active" },
          { where: { id: ProjectId } }
        );
      }
      const find = await ProjectWorker.findOne({
        where: { status: "Active", WorkerId },
      });
      if (find) throw { name: "AlreadyActive" };
      const result = await ProjectWorker.update(
        {
          status: "Active",
        },
        { where: { WorkerId } }
      );
      await ProjectWorker.update({
        where: {
          ProjectId: {
            [Op.not]: ProjectId,
          },
          WorkerId,
          status: "Occupied",
        },
      });
      res.status(200).json({ message: "Applied worker into Project" });
    } catch (error) {
      next(error);
    }
  }
  static async declineWorker(req, res, next) {
    try {
      const { projectWorkerId: WorkerId } = req.params;
      const { ProjectId } = req.body;
      const result = await ProjectWorker.destroy({
        where: { WorkerId, ProjectId },
      });
      res.status(200).json({ message: "Decline worker success" });
    } catch (error) {
      next(error);
    }
  }
  static async fetchProjectWorker(req, res, next) {
    try {
      const { id: WorkerId } = req.worker;
      console.log(WorkerId);
      const result = await ProjectWorker.findAll({
        where: {
          WorkerId,
          status: {
            [Op.not]: "Occupied",
          },
        },
        include: [
          {
            model: Project,
            include: [
              {
                model: Category,
              },
              {
                model: ProjectWorker,
              },
            ],
          },
        ],
      });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
  static async WorkerDetail(req, res, next) {
    try {
      const { id } = req.params;
      const result = await Worker.findOne({
        where: { id },
        attributes: { exclude: ["password"] },
        include: [
          {
            model: WorkerCategory,
            include: {
              model: Category,
            },
          },
          {
            model: Rating,
            attributes: [
              [Sequelize.fn("AVG", Sequelize.col("value")), "ratings"],
            ],
          },
        ],
        group: [
          "Worker.id",
          "WorkerCategories.id",
          "WorkerCategories->Category.id",
          "Ratings.ProjectId",
          "Ratings.WorkerId",
        ],
      });
      result.Ratings[0].dataValues.ratings = Number(result.Ratings[0].dataValues.ratings)
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProjectController;
