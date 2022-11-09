const PaymentController = require("../../controller/PaymentController");
const ProjectController = require("../../controller/ProjectController");
const WorkerController = require("../../controller/WorkerController");
const { authenticationWorker } = require("../../middlewares/authentication");

const WorkerRouter = require("express").Router();

WorkerRouter.post("/login", WorkerController.login);
WorkerRouter.post("/register", WorkerController.register);
WorkerRouter.use(authenticationWorker);
WorkerRouter.get("/transaction", PaymentController.fetchAllTransaction);
WorkerRouter.get("/projects", ProjectController.fetchAllProjectWorker);
WorkerRouter.get("/projects/:id", ProjectController.getOne);
WorkerRouter.get("/appliedProject", ProjectController.fetchProjectWorker);
WorkerRouter.get("/", WorkerController.profile);
WorkerRouter.post("/:projectId", WorkerController.applyProject);
WorkerRouter.put("/:id", WorkerController.editProfile);

module.exports = WorkerRouter;
