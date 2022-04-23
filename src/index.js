const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

// this proccess is use to triggered the making of database using ORM by sequelize
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

// these two endpoints below is used to access photos that is kept in the API
// there are two folder to differentiate the use, 1 for post and other for profile picture
app.use("/post_images", express.static(`${__dirname}/public/posts`));
app.use(
  "/avatar_images",
  express.static(`${__dirname}/public/profile_pictures`)
);

// this is for the CRUD request based on the category
// then the request will be sent to routers to be proccesed based on the needs of the front end
app.use("/post", postRouter);
app.use("/auth", authRouter);
app.use("/comment", commentRouter);
app.use("/user", userRouter);

app.listen(PORT, () => {
  console.log("listening in Port: ", PORT);
});
