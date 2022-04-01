const res = require("express/lib/response");

module.exports = function (err) {
  console.log(err);
  return res.status(500).json({
    message: "Server Error",
  });
};
