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
UserRouter.put("/:id", UserController.editProfile);
UserRouter.get("/:id", UserController.profile);
UserRouter.post("/projects", ProjectController.postProject);
UserRouter.get("/projects", ProjectController.fetchAll);
UserRouter.get("/projects/:id", ProjectController.getOne);
UserRouter.delete("/projects/:id", ProjectController.deleteProject);
UserRouter.put("/projects/:id", ProjectController.editProject);

module.exports = UserRouter;
