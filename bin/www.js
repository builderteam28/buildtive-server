const test = require("../app");
const port = process.env.PORT || 3000;

test.listen(port, () => {
  console.log(`running on ${port}`);
});
