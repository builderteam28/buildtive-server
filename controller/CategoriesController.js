const { Category, Worker, Rating, User } = require("../models");
class CategoryController {
  static fetchAll(req, res, next) {
    try {
      Category.findAll({
        order: [["id", "ASC"]],
        include: [],
      }).then((categories) => res.status(200).json(categories));
    } catch (error) {
      next(error);
    }
  }
  static async getOne(req, res, next) {
    try {
      const { id } = req.params;
      const category = await Category.findOne({
        where: { id },
        include: [
          {
            model: Worker,
            attributes: ["fullName", "email"],
          },
        ],
      });
      if (!category) throw { name: "CategoryNotFound" };
      res.status(200).json(category);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = CategoryController;
