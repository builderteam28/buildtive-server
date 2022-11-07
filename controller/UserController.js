const { compare } = require("../helpers/bcrypt");
const { sign } = require("../helpers/jwt");
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
      res.status(201).json({ message: "Created new User" });
    } catch (error) {
      next(error);
    }
  }
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email) throw { name: "EmailRequired" };
      if (!password) throw { name: "PasswordRequired" };
      const user = await User.findOne({
        where: {
          email,
        },
      });
      // console.log(user)
      if (!user) throw { name: "Unauthorized" };
      const validatePassword = compare(password, user.password);
      console.log(validatePassword)
      if (!validatePassword) throw { name: "Invalid email/password" };
      const payload = {
        id: user.id,
        email: user.email,
      };
      const access_token = sign(payload);
      res.status(200).json({ access_token: access_token, id: user.id, fullName: user.fullName });
    } catch (error) {
      // console.log(error)
      next(error);
    }
  }
  static async profile(req, res, next) {
    try {
      const { id } = req.user;
      if(!id) throw { name : "Unauthorized"}
      const result = await User.findByPk(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
  static async editProfile(req, res, next) {
    try {
      const { id } = req.user;
      const { fullName, address, phoneNumber } = req.body;
      if(!fullName) throw {name : "FullNameRequired" }
      if(!address) throw {name : "AddressRequired" }
      if(!phoneNumber) throw { name : "PhoneNumberRequired" }
      const update = await User.update(
        { fullName, address, phoneNumber },
        { where: { id } }
      );
      res.status(200).json({ message: "Profile updated" });
    } catch (error) {
      console.log(error)
      next(error);
    }
  }
}

module.exports = UserController;
