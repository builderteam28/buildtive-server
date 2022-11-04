const UserRouter = require("express").Router();
const UserController = require("../../controller/UserController");
const {authenticationUser} = require("../../middlewares/authentication");

UserRouter.post("/register", UserController.register);
UserRouter.post("/login", UserController.login);
UserRouter.use(authenticationUser)
UserRouter.get("/:id", UserController.profile)
UserRouter.put("/:id", UserController.editProfile)
module.exports = UserRouter;
