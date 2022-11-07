const CategoriesRouter = require("express").Router();
const CategoryController = require("../../controller/CategoriesController");

CategoriesRouter.get("/", CategoryController.fetchAll);
CategoriesRouter.get("/:id", CategoryController.getOne)

module.exports = CategoriesRouter;
