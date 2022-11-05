const { Project, Worker, Payment, Category } = require("../models");
class ProjectController {
  static async fetchAll(req, res, next) {
    try {
      const UserId = req.user.id;
      const projects = Project.findAll({ where: { UserId } });
      res.status(200).json(projects);
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
            model: Worker,
            attributes: { exclude: ["password", "createdAt", "updatedAt"] },
          },
          {
            model: Category,
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
    } catch (error) {
      next(error);
    }
  }
  static async editProject(req, res, next) {
    try {
    } catch (error) {
      next(error);
    }
  }
  static async deleteProject(req, res, next) {
    try {
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProjectController;
