const UserRouter = require("express").Router();
const UserController = require("../../controller/UserController");
const { authenticationUser } = require("../../middlewares/authentication");
const ProjectController = require("../../controller/ProjectController");

UserRouter.post("/register", UserController.register);
UserRouter.post("/login", UserController.login);
UserRouter.use(authenticationUser);
UserRouter.post("/projects", ProjectController.postProject);
UserRouter.get("/projects", ProjectController.fetchAll);
UserRouter.get("/:id", UserController.profile);
UserRouter.put("/:id", UserController.editProfile);
UserRouter.get("/projects/:id", ProjectController.getOne);
UserRouter.delete("/projects/:id", ProjectController.deleteProject);
UserRouter.put("/projects/:id", ProjectController.editProject);
module.exports = UserRouter;
