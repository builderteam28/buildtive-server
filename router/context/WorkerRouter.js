const WorkerController = require("../../controller/WorkerController");
const { authenticationWorker } = require("../../middlewares/authentication");

const WorkerRouter = require("express").Router();

WorkerRouter.post("/login", WorkerController.login);
WorkerRouter.post("/register", WorkerController.register);
WorkerRouter.use(authenticationWorker);
WorkerRouter.get("/:projectId", WorkerController.applyProject);
WorkerRouter.delete("/projectWorkerId", WorkerController.cancelApply);
WorkerRouter.get("/:id", WorkerController.profile);
WorkerRouter.put("/:id", WorkerController.editProfile);

module.exports = WorkerRouter;
