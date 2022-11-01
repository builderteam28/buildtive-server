const UserRouter = require("express").Router();
const UserController = require("../../controller/UserController");
const authentication = require("../../middlewares/authentication");

UserRouter.post("/register", UserController.register);
UserRouter.post("/login", UserController.login);
UserRouter.use(authentication)
UserRouter.get("/:id", UserController.profile)
UserRouter.put("/:id", UserController.editProfile)
module.exports = UserRouter;
