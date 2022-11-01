const RatingController = require("../../controller/RatingController");

const RatingRouter = require("express").Router();

RatingRouter.post("/", RatingController.rate);

module.exports = RatingRouter;
