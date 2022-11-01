const router = require("express").Router();
const CategoriesRouter = require("./context/CategoriesRouter");
const PaymentRouter = require("./context/PaymentRouter");
const ProjectRouter = require("./context/ProjectRouter");
const RatingRouter = require("./context/RatingsRouter");
const UserRouter = require("./context/UserRouter");
const WorkerRouter = require("./context/WorkerRouter");

router.use("/users", UserRouter);
router.use("/workers", WorkerRouter);
router.use("/projects", ProjectRouter);
router.use("/payments", PaymentRouter);
router.use("/categories", CategoriesRouter);
router.use("/ratings", RatingRouter);

module.exports = router;
