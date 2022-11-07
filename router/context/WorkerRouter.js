const ProjectController = require("../../controller/ProjectController");
const WorkerController = require("../../controller/WorkerController");
const { authenticationWorker } = require("../../middlewares/authentication");

const WorkerRouter = require("express").Router();

WorkerRouter.post("/login", WorkerController.login);
WorkerRouter.post("/register", WorkerController.register);
WorkerRouter.use(authenticationWorker);
WorkerRouter.get("/projects", ProjectController.fetchAllProjectWorker)
WorkerRouter.post("/:projectId", WorkerController.applyProject);
WorkerRouter.get("/:id", WorkerController.profile);
WorkerRouter.put("/:id", WorkerController.editProfile);

module.exports = WorkerRouter;
