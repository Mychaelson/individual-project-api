const postRouter = require("./post");
const authRouter = require("./auth");
const commentRouter = require("./comment");
const userRouter = require("./user");

// to organize the router, all were gathered in one objct, then exported
module.exports = {
  postRouter,
  authRouter,
  commentRouter,
  userRouter,
};
