if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const cors = require("cors");
const router = require("./router/index");
const errorHandler = require("./middlewares/errorHandler");
const port = 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);
app.use(errorHandler);

app.listen(port, () => {
  console.log(
    `Final Project: \nPascal, Chossy, Fahmi\nBagus, Yosia\nOn Port: ${port}`
  );
});

// module.exports = app;
