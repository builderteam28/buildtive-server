const RatingController = require("../../controller/RatingController");
const {authenticationUser} = require('../../middlewares/authentication')

const RatingRouter = require("express").Router();

RatingRouter.post("/:id", authenticationUser ,RatingController.rate);

module.exports = RatingRouter;
