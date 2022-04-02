const res = require("express/lib/response");

const serverErrorHandler = (err) => {
  console.log(err);
  return res.status(500).json({
    message: "Server Error",
  });
};

module.exports = serverErrorHandler;
