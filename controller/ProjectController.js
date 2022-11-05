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
      const {
        name,
        workHours,
        totalWorker,
        cost,
        UserId,
        CategoryId,
        long,
        lat,
      } = req.body;

      const createdProject = await Project.create({
        name,
        workHours,
        totalWorker,
        cost,
        UserId,
        CategoryId,
        long,
        lat,
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
      if (!find) throw { name: "ProjectNotFound" };
      const { name, workHours, totalWorker, cost, status } = req.body;
      const result = await Project.update(
        { name, workHours, totalWorker, cost, status },
        { where: { id } }
      );
      res.status(200).json({message : "Project already updated"})
    } catch (error) {
      next(error);
    }
  }
  static async deleteProject(req, res, next) {
    try {
      const { id } = req.params;
      const find = await Project.findByPk(id);
      if (!find) throw { name: "ProjectNotFound" };
      if (find.status == "active") throw { name: "ProjectIsActive" };
      await Project.destroy({ where: { id } });
      res.status(200).json({ message: "Deleted Project" });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = ProjectController;
