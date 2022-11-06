const UserRouter = require("express").Router();
const UserController = require("../../controller/UserController");
const { authenticationUser } = require("../../middlewares/authentication");
const ProjectController = require("../../controller/ProjectController");
const CategoryController = require("../../controller/CategoriesController");

UserRouter.post("/register", UserController.register);
UserRouter.post("/login", UserController.login);
UserRouter.get("/categories", CategoryController.fetchAll);
UserRouter.get("/categories/:id", CategoryController.getOne);
UserRouter.use(authenticationUser);
UserRouter.get("/projects", ProjectController.fetchAll);
UserRouter.post("/projects", ProjectController.postProject);
UserRouter.patch("/projects/:workerId", ProjectController.acceptWorker);
UserRouter.delete(
  "/projects/manageWorker/:projectWorkerId",
  ProjectController.declineWorker
);
UserRouter.get("/projects/:id", ProjectController.getOne);
UserRouter.delete("/projects/:id", ProjectController.deleteProject);
UserRouter.put("/projects/:id", ProjectController.editProject);
UserRouter.put("/:id", UserController.editProfile);
UserRouter.get("/:id", UserController.profile);

module.exports = UserRouter;
