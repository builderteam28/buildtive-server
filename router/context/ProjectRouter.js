const ProjectRouter = require("express").Router();
const ProjectController = require("../../controller/ProjectController");
const {authenticationUser} = require("../../middlewares/authentication");

ProjectRouter.get("/", ProjectController.fetchAll);
ProjectRouter.get("/:id", ProjectController.getOne);
ProjectRouter.use(authenticationUser);
ProjectRouter.post("/", ProjectController.postProject);
ProjectRouter.delete("/:id", ProjectController.deleteProject);
ProjectRouter.put("/:id", ProjectController.editProject);

module.exports = ProjectRouter;
