if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET_KEY;
function sign(payload) {
  return jwt.sign(payload, secret);
}
function verify(payload) {
  return jwt.verify(payload, secret);
}

module.exports = {
  sign,
  verify,
};
