const router = require("express").Router();
const PaymentRouter = require("./context/PaymentRouter");
const UserRouter = require("./context/UserRouter");
const WorkerRouter = require("./context/WorkerRouter");

router.use("/users", UserRouter);
router.use("/workers", WorkerRouter);
router.use("/payments", PaymentRouter);

module.exports = router;
