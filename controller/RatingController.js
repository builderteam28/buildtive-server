const { Rating, Project, ProjectWorker, Worker } = require("../models");
class RatingController {
  static async rate(req, res, next) {
    try {
      const { id: UserId } = req.user;
      const { value, ProjectId: id } = req.body;
      const find = await Project.findOne({
        where: { id },
        include: {
          model: ProjectWorker,
        },
      });
      let bulkWorker = [];
      find.ProjectWorkers.forEach((el) => {
        bulkWorker.push({
          value,
          WorkerId: el.WorkerId,
          ProjectId: id,
          UserId,
        });
      });
      await Rating.bulkCreate(bulkWorker);
      await Project.update({ status: "Completed" }, { where: { id } });
      res.status(200).json({message: `Rate has been posted into Workers Profile`});
    } catch (error) {
      next(error);
    }
  }
}

module.exports = RatingController;
