const { User } = require("../models");
class UserController {
  static async register(req, res, next) {
    try {
      const { fullName, email, password, phoneNumber, address, DeviceId } =
        req.body;
      const result = await User.create({
        fullName,
        email,
        password,
        phoneNumber,
        address,
        DeviceId,
      });
      console.log(result)
      res.status(201).json({message : "Created new User"})
    } catch (error) {
      next(error);
    }
  }
  static async login(req, res, next) {
    try {

    } catch (error) {
      next(error);
    }
  }
  static async profile(req, res, next) {
    try {
    } catch (error) {
      next(error);
    }
  }
  static async editProfile(req, res, next) {
    try {
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
