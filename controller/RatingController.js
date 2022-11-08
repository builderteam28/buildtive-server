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
      find.ProjectWorkers.forEach(el => {
        bulkWorker.push({
          value,
          WorkerId : el.WorkerId,
          ProjectId:id,
          UserId
        })
      });
      const result = await Rating.bulkCreate(bulkWorker);
      res.status(200).json(find)
    } catch (error) {
      next(error);
    }
  }
}

module.exports = RatingController;
