const { User, Password } = require("../lib/sequelize");
const serverErrorHandler = require("../lib/serverErrorHandler");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");

const authControllers = {
  registerUser: async (req, res) => {
    // 1. cek apakah username/email sudah digunakan
    // 2. register user

    try {
      const { username, full_name, email, password } = req.body;

      const isUsernameAndEmailTaken = await User.findOne({
        where: {
          [Op.or]: [{ username }, { email }],
        },
      });

      if (isUsernameAndEmailTaken) {
        return res.status(400).json({
          message: "Username or Email has Been Taken",
        });
      }

      const hashedPassword = bcrypt.hashSync(password, 5);

      const registerUser = await User.create({
        username,
        full_name,
        email,
      });

      const addUserPassword = await Password.create({
        password: hashedPassword,
        user_id: registerUser.id,
      });

      return res.status(200).json({
        message: "User Added",
      });
    } catch (err) {
      serverErrorHandler(err);
    }
  },
  loginUser: async (req, res) => {
    try {
      const { username, password } = req.body;

      const findUser = await User.findOne({
        where: {
          username,
        },
        include: Password,
      });

      if (!findUser) {
        return res.status(400).json({
          message: "Username or Password is wrong",
        });
      }

      const isPasswordCorrect = bcrypt.compareSync(
        password,
        findUser.password.password
      );

      if (!isPasswordCorrect) {
        return res.status(400).json({
          message: "Username or Password is wrong",
        });
      }

      delete findUser.dataValues.password;

      return res.status(200).json({
        message: "User Logged In",
        result: {
          findUser,
          token: 12345,
        },
      });
    } catch (err) {
      serverErrorHandler(err);
    }
  },
};

module.exports = authControllers;
