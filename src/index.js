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

const { postRouter, userRouter } = require("./router");

app.use("/post", postRouter);
app.use("/user", userRouter);

app.listen(PORT, () => {
  console.log("listening in Port: ", PORT);
});
