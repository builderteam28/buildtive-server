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
      console.log(error)
      next(error);
    }
  }
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email) {
        throw { name: "EmailRequired" };
      }

      if (!password) {
        throw { name: "PasswordRequired" };
      }

      const foundWorker = await Worker.findOne({
        where: {
          email,
        },
      });

      if (!foundWorker) {
        throw { name: "Unauthorized" };
      }

      const isMatchPassword = compare(password, foundWorker.password);

      if (!isMatchPassword) {
        throw { name: "Unauthorized" };
      }

      const payload = {
        id: foundWorker.id,
        email: foundWorker.email,
      };

      const token = sign(payload);

      res.status(200).json({
        access_token: token,
        id: payload.id,
        email:payload.email
      });
    } catch (error) {
      next(error);
      console.log(error)
    }
  }
  static async profile(req, res, next) {
    try {
      const { id } = req.params;
      const foundWorker = await Worker.findByPk(id, {attributes:{exclude:["password", "id","updatedAt"]},include:[]});
      // console.log(foundWorker)

      if (!foundWorker) {
        throw { name: "NotFound" };
      }

      res.status(200).json(foundWorker);
    } catch (error) {
      console.log(error)
      next(error);
    }
  }
  static async editProfile(req, res, next) {
    try {
      const { id } = req.params;
      const { fullName, phoneNumber, address, birthDate } = req.body;

      const updatedWorkerProfile = await Worker.findByPk(id);

      if (!updatedWorkerProfile) {
        throw { name: "NotFound" };
      }

      await Worker.update(
        {
          fullName,
          phoneNumber,
          address,
          birthDate,
        },
        {
          where: { id },
        }
      );

      res.status(201).json({ message: "Success to update profile" });
    } catch (error) {
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
