const UserRouter = require("express").Router();
const UserController = require("../../controller/UserController");
const { authenticationUser } = require("../../middlewares/authentication");
const ProjectController = require("../../controller/ProjectController");
const WorkerController = require("../../controller/WorkerController");
const RatingController = require("../../controller/RatingController");

UserRouter.post("/register", UserController.register);
UserRouter.post("/login", UserController.login);
UserRouter.use(authenticationUser);
UserRouter.post("/projects", ProjectController.postProject);
UserRouter.patch("/projects/accept/:WorkerId", ProjectController.acceptWorker);
UserRouter.patch(
  "/projects/decline/:WorkerId",
  ProjectController.declineWorker
);
UserRouter.post("/projects/rate", RatingController.rate);
UserRouter.get("/projects/:id", ProjectController.getOne);
UserRouter.put("/projects/:id", ProjectController.editProject);
UserRouter.get("/workers/:categoryId", WorkerController.getAllByCategories);
UserRouter.get("/workers/profile/:id", ProjectController.WorkerDetail);
UserRouter.put("/:id", UserController.editProfile);
UserRouter.get("/:id", UserController.profile);

module.exports = UserRouter;
