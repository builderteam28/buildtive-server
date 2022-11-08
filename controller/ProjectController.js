const {
  Project,
  Worker,
  Payment,
  Category,
  ProjectWorker,
} = require("../models");
class ProjectController {
  static fetchAll(req, res, next) {
    const UserId = req.user.id;
    Project.findAll({ where: { UserId } }).then((projects) =>
      res.status(200).json(projects)
    );
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
      const projects = await Project.findAll();
      console.log(find, projects, `<~~~`);
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

  // static async acceptWorker(req, res, next) {
  //   try {
  //     const { ProjectWorkerId } = req.params;
  //     const find = await ProjectWorker.findByPk(ProjectWorkerId);
  //     if (find.status == "Applicant") {
  //       await ProjectWorker.update(
  //         {
  //           status: "Active",
  //         },
  //         { where: { WorkerId: find.WorkerId } }
  //       );
  //       await ProjectWorker.update(
  //         {
  //           status: "Occupied",
  //         },
  //         {
  //           where: {
  //             WorkerId: find.WorkerId,
  //             status: "Applicant",
  //           },
  //         }
  //       );
  //       return res.status(200).json({ message: "Applied worker into Project" });
  //     }
  //     if (find.status == "Active") throw { name: "AlreadyActive" };
  //     if (find.status == "Occupied") throw { name: "occupied" };
  //   } catch (error) {
  //     next(error);
  //   }
  // }
  // static async declineWorker(req, res, next) {
  //   try {
  //     const { projectWorkerId: WorkerId } = req.params;
  //     const result = await ProjectWorker.destroy({ where: { WorkerId } });
  //     res.status(200).json({ message: "Decline worker success" });
  //   } catch (error) {
  //     next(error);
  //   }
  // }
}

module.exports = ProjectController;
