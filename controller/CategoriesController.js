const { Category, Worker } = require("../models");
class CategoryController {
  static fetchAll(req, res, next) {
    Category.findAll({
      order: [["id", "ASC"]],
      include: [],
    }).then((categories) => res.status(200).json(categories));
  }
  static async getOne(req, res, next) {
    try {
      const { id } = req.params;
      const category = await Category.findOne({
        where: { id },
        include: { model: Worker, attributes: ["fullName", "email"] },
      });
      if(!category) throw { name : "CategoryNotFound"}
      res.status(200).json(category);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CategoryController;
