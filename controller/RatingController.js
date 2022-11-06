const { Rating } = require("../models")
class RatingController {
  static async rate(req, res, next) {
    try {
      const {id} = req.params
      const { value, WorkerId } = req.body;
      let addRating = await Rating.create({ value, UserId:req.user.id, WorkerId, ProjectId: id });
      console.log(addRating);

      res.status(201).json(`add rating success`);
    } catch (error) {
      next(error)
    }
  }
}

module.exports = RatingController;
