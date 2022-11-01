const WorkerController = require("../../controller/WorkerController");
const authentication = require("../../middlewares/authentication");

const WorkerRouter = require("express").Router();

WorkerRouter.post("/login", WorkerController.login)
WorkerRouter.post("/register", WorkerController.register)
WorkerRouter.use(authentication)
WorkerRouter.get("/:id", WorkerController.profile)
WorkerRouter.put("/:id", WorkerController.editProfile)

module.exports = WorkerRouter;
