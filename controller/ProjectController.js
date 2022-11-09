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
const axios = require("axios");
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
          model: Rating,
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
  static fetchAllProjectWorker(req, res, next) {
    Project.findAll({
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
    }).then((projects) => res.status(200).json(projects));
  }
  static async getOne(req, res, next) {
    try {
      const { id } = req.params;
      const project = await Project.findOne({
        where: { id },
        include: [
          {
            model: Category,
          },
          {
            model: ProjectWorker,
            include: {
              model: Worker,
              attributes: { exclude: ["password"] },
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
      const { id: UserId } = req.user;
      const {
        name,
        tenor,
        totalWorker,
        cost,
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
      const category = await Category.findOne({
        where: { id: CategoryId },
        include: [
          {
            model: WorkerCategory,
            include: [
              {
                model: Worker,
                attributes: ["id", "email", "fullName", "deviceId"],
              },
            ],
          },
        ],
      });

      let expoTokens = category.WorkerCategories.filter((el) => {
        return el.Worker.deviceId != null;
      }).map((el) => el.Worker.deviceId);

      async function sendPushNotification(expoPushToken) {
        const message = {
          to: expoPushToken,
          sound: "default",
          title: "Projects " + name + " now exists",
          body: "Just only need " + totalWorker + " workers lets go to work!",
        };
        await axios("https://exp.host/--/api/v2/push/send", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Accept-encoding": "gzip, deflate",
            "Content-Type": "application/json",
          },
          data: message,
        });
        return "Success";
      }
      const bulkSendMessage = async () => {
        try {
          const response = await Promise.all(
            expoTokens.map(async (token) => {
              return await sendPushNotification(token);
            })
          );
          console.log(response);
        } catch (error) {
          console.log(error);
        }
      };

      bulkSendMessage();
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
  static async acceptWorker(req, res, next) {
    try {
      const { WorkerId } = req.params;
      const { ProjectId } = req.body;
      const project = await Project.findByPk(ProjectId);
      if (project.status === "Active") throw { name: "ProjectIsActive" };
      const get = await ProjectWorker.findAll({
        where: { ProjectId, status: "Accepted" },
      });
      if (get.length === project.totalWorker - 1) {
        await Project.update(
          { status: "Active" },
          { where: { id: ProjectId } }
        );
      }
      const find = await ProjectWorker.findOne({
        where: { status: "Accepted", WorkerId },
      });
      if (find) throw { name: "AlreadyActive" };
      const result = await ProjectWorker.update(
        {
          status: "Accepted",
        },
        { where: { WorkerId } }
      );
      await ProjectWorker.update(
        {
          status: "Occupied",
        },
        {
          where: {
            ProjectId: {
              [Op.not]: ProjectId,
            },
            status: {
              [Op.not]: "Completed",
            },
            WorkerId,
          },
        }
      );
      res.status(200).json({ message: "Applied worker into Project" });
    } catch (error) {
      next(error);
    }
  }
  static async declineWorker(req, res, next) {
    try {
      const { WorkerId } = req.params;
      const { ProjectId } = req.body;
      const result = await ProjectWorker.update(
        {
          status: "Rejected",
        },
        { where: { WorkerId, ProjectId } }
      );
      res.status(200).json({ message: "Decline worker success" });
    } catch (error) {
      next(error);
    }
  }
  static async fetchProjectWorker(req, res, next) {
    const { id: WorkerId } = req.worker;
    ProjectWorker.findAll({
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
    }).then((projectWorkers) => res.status(200).json(projectWorkers));
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
              [sequelize.fn("COUNT", Sequelize.col("value")), "reviews"],
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
      if (!result) throw { name: "WorkerNotFound" };
      if (result.Ratings.length) {
        result.Ratings[0].dataValues.ratings = Number(
          result.Ratings[0].dataValues.ratings
        );
        result.Ratings[0].dataValues.reviews = Number(
          result.Ratings[0].dataValues.reviews
        );
      }
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProjectController;
