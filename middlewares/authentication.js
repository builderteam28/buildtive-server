const { verify } = require("../helpers/jwt");
const { User, Worker } = require("../models");

const authenticationUser = async (req, res, next) => {
  try {
    const { access_token } = req.headers;
    if (!access_token) throw { name: "Invalid Token" };
    const payload = verify(access_token);
    const user = await User.findByPk(payload.id);
    // console.log("Ini user", user)
    if (!user) throw { name: "Invalid Token" };
    req.user = {
      id: user.id,
      email: user.email,
    };
    next();
  } catch (error) {
    // console.log(error)
    next(error);
  }
};
const authenticationWorker = async (req, res, next) => {
  try {
    const { access_token } = req.headers;
    if (!access_token) throw { name: "Invalid Token" };
    const payload = verify(access_token);
    const worker = await Worker.findByPk(payload.id)
    if (!worker) throw { name: "Invalid Token" };
    req.worker = {
      id: worker.id,
      email: worker.email,
    };
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { authenticationUser, authenticationWorker };
