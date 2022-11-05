const { Category, Worker } = require("../models");
class CategoryController {
  static async fetchAll(req, res, next) {
    try {
      const categories = await Category.findAll({
        order: [["id", "ASC"]],
        include: [],
      });
      res.status(200).json(categories);
    } catch (error) {
      next(error);
    }
  }
  static async getOne(req, res, next) {
    try {
      const { id } = req.params;
      const category = await Category.findOne({
        where: { id },
        include: {model : Worker, attributes: ["fullName", "email"]},
      });
      res.status(200).json(category);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CategoryController;
