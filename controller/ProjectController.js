const {
  Project,
  Worker,
  Payment,
  Category,
  ProjectWorker,
} = require("../models");
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
      if (find.status == "Active") throw { name: "ProjectIsActive" };
      await Project.destroy({ where: { id } });
      res.status(200).json({ message: "Deleted Project" });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  static async acceptWorker(req, res, next) {
    try {
      const { workerId: WorkerId } = req.params;
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
      res.status(200).json({ message: "Applied worker into Project" });
    } catch (error) {
      next(error);
    }
  }
  static async declineWorker(req, res, next) {
    try {
      const { projectWorkerId: WorkerId } = req.params;
      const result = await ProjectWorker.destroy({ where: { WorkerId } });
      res.status(200).json({ message: "Decline worker success" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProjectController;
