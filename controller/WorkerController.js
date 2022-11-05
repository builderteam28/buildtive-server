const { Worker, Category, Project } = require("../models");
const { compare } = require("../helpers/bcrypt");
const { sign } = require("../helpers/jwt");
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
      res.status(201).json({
        message: `Worker account with ${newWorker.email} successfully created`,
      });
    } catch (error) {
      next(error);
    }
  }
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
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
      res.status(200).json({
        access_token: token,
        id: payload.id,
        email: payload.email,
      });
    } catch (error) {
      next(error);
    }
  }
  static async profile(req, res, next) {
    try {
      const { id } = req.worker
      const result = await Worker.findByPk(id)
      res.status(200).json(result)
    } catch (error) {
      next(error);
    }
  }
  static async editProfile(req, res, next) {
    try {
      const { id } = req.worker;
      const { fullName, phoneNumber, address } = req.body;

      const updatedWorkerProfile = await Worker.findByPk(id);

      if (!updatedWorkerProfile) {
        throw { name: "NotFound" };
      }

      await Worker.update(
        {
          fullName,
          phoneNumber,
          address,
        },
        {
          where: { id },
        }
      );

      res.status(200).json({ message: "Success to update profile" });
    } catch (error) {
      console.log(error)
      next(error);
    }
  }
  static async pushNotification(req, res, next) {
    try {
    } catch (error) {
      next(error);
    }
  }
}

module.exports = WorkerController;
