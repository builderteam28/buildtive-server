const {
  Payment,
  User,
  ProjectWorker,
  Worker,
  Project,
  sequelize,
} = require("../models");
const midtransClient = require("midtrans-client");
const { Op } = require("sequelize");
const serverKey = process.env.SERVER_KEY;

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
      if (allWorker.length <= 1) totalPay = +cost;
      let snap = new midtransClient.Snap({
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
      res.status(200).json(transaction);
      await t.commit();
    } catch (error) {
      await t.rollback();
      next(error);
    }
  }
  static async createPayment(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { ProjectId } = req.params;
      const { cost } = req.body;
      const allWorker = await ProjectWorker.findAll({
        where: { ProjectId },
      });
      let temp = [];
      allWorker.forEach((el) => {
        temp.push({
          WorkerId: el.WorkerId,
          ProjectId,
          amount: +cost,
          status: "Paid",
        });
      });
      const payments = await Payment.bulkCreate(temp, { transaction: t });
      res.status(200).json(payments);
      await t.commit();
    } catch (error) {
      await t.rollback();
      next(error);
    }
  }
  static async updatePayment(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { ProjectId } = req.params;
      const { cost } = req.body;
      const allWorker = await ProjectWorker.findAll({
        where: { ProjectId },
      });

      let workersId = [];
      allWorker.forEach((el) => {
        workersId.push(el.WorkerId);
      });
      const updateStatus = await Payment.update(
        {
          status: "Completed",
        },
        {
          where: {
            ProjectId,
            WorkerId: workersId,
          },
          transaction: t
        }
      );
      const updateProjectWorkerStatus = await ProjectWorker.update(
        {
          status: "Completed",
        },
        {
          where: {
            ProjectId,
            WorkerId: workersId,
          },
          transaction: t
        }
      )
      const increaseBalance = await Worker.increment(
        { balance: cost },
        {
          where: {
            id: workersId,
          },
          transaction: t
        }
      );

      const updateProject = await Project.update(
        {
          status: "Completed",
        },
        {
          where: {
            id: ProjectId,
          },
          transaction: t
        }
      );
      res.status(200).json({ updateStatus, updateProjectWorkerStatus, increaseBalance, updateProject });
      await t.commit();
    } catch (error) {
      console.log(error);
      await t.rollback();
      next(error);
    }
  }
}

module.exports = PaymentController;
