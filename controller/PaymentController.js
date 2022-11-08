const { Payment, User, ProjectWorker, sequelize } = require("../models");
const midtransClient = require("midtrans-client");
const serverKey = process.env.SERVER_KEY;
// const serverKey = "SB-Mid-server-DsAOMgZPAeVSe7CwWtHe08Ag"

class PaymentController {
  static async addPayment(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.user;
      const { ProjectId, cost } = req.body;
      const allWorker = await ProjectWorker.findAll({
        where: { ProjectId },
      }); 
      let totalPay = +cost * allWorker.length;
      if(allWorker.length <= 1) totalPay = +cost
      let temp = [];
      // const [payment, created] = await Payment.findOrCreate({
      //   where: { ProjectId },
      //   defaults: {
      //     ProjectId,
      //     amount: cost,
      //   },
      // });
      allWorker.forEach((el) => {
        temp.push({
          WorkerId: el.WorkerId,
          ProjectId,
          amount: +cost,
          status: "Paid",
        });
      });
      await Payment.bulkCreate(temp, { transaction: t });
      let snap = new midtransClient.Snap({
        // Set to true if you want Production Environment (accept real transaction).
        isProduction: false,
        serverKey: serverKey,
      });
      const user = await User.findByPk(id);
      const orderId = ProjectId + totalPay + new Date().getTime();
      let parameter = {
        transaction_details: {
          order_id: orderId,
          gross_amount: totalPay,
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
      const transaction = await snap.createTransaction(parameter);
      let transactionToken = transaction.token;
      console.log("ini token nya", transactionToken);
      res.status(200).json({ transactionToken });
      await t.commit();
    } catch (error) {
      console.log(error);
      await t.rollback();
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
