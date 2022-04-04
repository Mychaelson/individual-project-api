const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const { sequelize } = require("./lib/sequelize");
sequelize.sync({ alter: true });

const PORT = process.env.PORT;

const app = express();

app.use(cors());
app.use(express.json());

const {
  postRouter,
  authRouter,
  commentRouter,
  userRouter,
} = require("./router");

app.use("/post_images", express.static(`${__dirname}/public/posts`));
app.use(
  "/avatar_images",
  express.static(`${__dirname}/public/profile_pictures`)
);

app.use("/post", postRouter);
app.use("/auth", authRouter);
app.use("/comment", commentRouter);
app.use("/user", userRouter);

app.listen(PORT, () => {
  console.log("listening in Port: ", PORT);
});
