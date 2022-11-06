const PaymentRouter = require("express").Router();
const PaymentController = require("../../controller/PaymentController");
const { authenticationUser } = require("../../middlewares/authentication");

PaymentRouter.use(authenticationUser);
PaymentRouter.post("/", PaymentController.addPayment);
PaymentRouter.patch("/:ProjectId", PaymentController.editStatusPayment);

module.exports = PaymentRouter;
