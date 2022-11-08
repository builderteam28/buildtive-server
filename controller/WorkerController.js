const {
  Worker,
  Rating,
  ProjectWorker,
  WorkerCategory,
  Category,
  Sequelize,
} = require("../models");
const { compare } = require("../helpers/bcrypt");
const { sign } = require("../helpers/jwt");
const RatingController = require("./RatingController");
const { Op } = require("sequelize");
class WorkerController {
  static async register(req, res, next) {
    try {
      const {
        email,
        password,
        fullName,
        phoneNumber,
        address,
        birthDate,
        idNumber,
        CategoryId,
      } = req.body;
      const newWorker = await Worker.create({
        email,
        password,
        fullName,
        phoneNumber,
        birthDate,
        address,
        idNumber,
      });
      const newWorkerCategory = await WorkerCategory.create({
        WorkerId: newWorker.id,
        CategoryId,
      });
      res.status(201).json({
        message: `Worker account with ${newWorker.email} successfully created`,
      });
    } catch (error) {
      next(error);
    }
  }
  static async login(req, res, next) {
    try {
      const { email, password, DeviceId } = req.body;
      if (!email) throw { name: "EmailRequired" };
      if (!password) throw { name: "PasswordRequired" };
      const foundWorker = await Worker.findOne({
        where: {
          email,
        },
      });
      if (!foundWorker) throw { name: "Unauthorized" };
      const isMatchPassword = compare(password, foundWorker.password);
      if (!isMatchPassword) throw { name: "Unauthorized" };
      const payload = {
        id: foundWorker.id,
        email: foundWorker.email,
      };
      const token = sign(payload);
      await Worker.update(
        {
          DeviceId: DeviceId,
        },
        {
          where: {
            email: foundWorker.email,
          },
        }
      );
      res.status(200).json({
        access_token: token,
        id: payload.id,
        fullName: foundWorker.fullName,
      });
    } catch (error) {
      next(error);
    }
  }
  static async profile(req, res, next) {
    const { id } = req.worker;
    Worker.findByPk(id).then((profile) => res.status(200).json(profile));
  }
  static async editProfile(req, res, next) {
    const { id } = req.worker;
    const { fullName, phoneNumber, address } = req.body;
    Worker.update(
      {
        fullName,
        phoneNumber,
        address,
      },
      {
        where: { id },
      }
    ).then((message) =>
      res.status(200).json({ message: "Success to update profile" })
    );
  }
  // static async pushNotification(req, res, next) {
  //   try {
  //   } catch (error) {
  //     next(error);
  //   }
  // }
  static async applyProject(req, res, next) {
    try {
      const { projectId: ProjectId } = req.params;
      const { id: WorkerId } = req.worker;
      const find = await ProjectWorker.findOne({
        where: {
          [Op.or]: [
            { status: "Active" },
            WorkerId,
            { status: "Applicant", WorkerId },
          ],
        },
      });
      if (find) throw { name: "AlreadyActive" };
      const result = await ProjectWorker.create({
        ProjectId,
        WorkerId,
      });
      res.status(201).json({ message: "Project applied" });
    } catch (error) {
      next(error);
    }
  }
  static async getAllByCategories(req, res, next) {
    try {
      const { categoryId } = req.params;
      const find = await Category.findByPk(categoryId);
      if (!find) throw { name: "CategoryNotFound" };
      const workers = await WorkerCategory.findAll({
        where: { CategoryId: categoryId },
        include: [
          {
            model: Worker,
            include: {
              model: Rating,
              attributes: [
                [Sequelize.fn("AVG", Sequelize.col("value")), "ratings"],
              ],
            },
          },
        ],
        group: [
          "WorkerCategory.id",
          "Worker.id",
          "Worker->Ratings.ProjectId",
          "Worker->Ratings.WorkerId",
        ],
      });
      res.status(200).json(workers);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = WorkerController;
