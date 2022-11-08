const { Payment, User } = require("../models");
const midtransClient = require("midtrans-client");
const serverKey = process.env.SERVER_KEY;

class PaymentController {
  static async addPayment(req, res, next) {
    try {
      const { ProjectId, cost } = req.body;

      const [payment, created] = await Payment.findOrCreate({
        where: { ProjectId },
        defaults: {
          ProjectId,
          amount: cost,
        },
      });
      let snap = new midtransClient.Snap({
        // Set to true if you want Production Environment (accept real transaction).
        isProduction: false,
        serverKey: serverKey,
      });
      const user = await User.findByPk(1);
      const orderId = ProjectId + payment.amount + new Date().getTime();
      let parameter = {
        transaction_details: {
          order_id: orderId,
          gross_amount: payment.amount,
        },
        credit_card: {
          secure: true,
        },
        customer_details: {
          fullName: user.fullName,
          email: user.email,
          phone: user.phoneNumber,
        },
      };

      snap.createTransaction(parameter).then((transaction) => {
        // transaction token
        res.status(200).json({ transaction });
      });
    } catch (error) {
      next(error);
    }
  }
  static async editStatusPayment(req, res, next) {
    const { ProjectId } = req.params;
    Payment.update({ status: "Paid" }, { where: { ProjectId } }).then(
      (message) => res.status(200).json({ message: "payment paid" })
    );
  }
}

module.exports = PaymentController;
