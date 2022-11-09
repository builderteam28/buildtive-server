const PaymentRouter = require("express").Router();
const PaymentController = require("../../controller/PaymentController");
const { authenticationUser } = require("../../middlewares/authentication");

PaymentRouter.use(authenticationUser);
PaymentRouter.post("/", PaymentController.addPayment);
PaymentRouter.post("/:ProjectId", PaymentController.createPayment);
PaymentRouter.put("/:ProjectId", PaymentController.updatePayment);

module.exports = PaymentRouter;
