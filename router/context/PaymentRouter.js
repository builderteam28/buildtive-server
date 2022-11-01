const PaymentRouter = require("express").Router();
const PaymentController = require("../../controller/PaymentController");

PaymentRouter.post("/", PaymentController.addPayment);
PaymentRouter.patch("/:id", PaymentController.editStatusPayment)

module.exports = PaymentRouter;
