const { User, Password, ForgotPasswordToken } = require("../lib/sequelize");
const serverErrorHandler = require("../lib/serverErrorHandler");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const { generateToken, verifyToken } = require("../lib/jwt");
const fs = require("fs");
const mustache = require("mustache");
const mailer = require("../lib/mailer");
const { nanoid } = require("nanoid");
const moment = require("moment");

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

      // Verification email
      const verificationToken = generateToken(
        {
          id: registerUser.id,
          isEmailVerification: true,
        },
        "1h"
      );

      const verificationLink = `http://localhost:2000/auth/verify/${verificationToken}`;

      const template = fs
        .readFileSync(__dirname + "/../templates/verify.html")
        .toString();

      const renderedTemplate = mustache.render(template, {
        username,
        verify_url: verificationLink,
        full_name,
      });

      await mailer({
        to: email,
        subject: "Verify your account!",
        html: renderedTemplate,
      });

      return res.status(200).json({
        message: "User Added",
      });
    } catch (err) {
      serverErrorHandler(err, req, res);
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

      const token = generateToken({ id: findUser.id });

      return res.status(200).json({
        message: "User Logged In",
        result: {
          findUser,
          token,
        },
      });
    } catch (err) {
      serverErrorHandler(err, req, res);
    }
  },
  keepLogin: async (req, res) => {
    try {
      const { token } = req;

      const renewedToken = generateToken({ id: token.id });

      const findUser = await User.findByPk(token.id);

      delete findUser.dataValues.password;

      return res.status(200).json({
        message: "Renewed user token",
        result: {
          user: findUser,
          token: renewedToken,
        },
      });
    } catch (err) {
      serverErrorHandler(err, req, res);
    }
  },
  verifyUser: async (req, res) => {
    try {
      const { token } = req.params;

      const isTokenVerified = await verifyToken(token);

      if (!isTokenVerified || !isTokenVerified.isEmailVerification) {
        return res.status(400).json({
          message: "Token invalid!",
        });
      }

      await User.update(
        { is_verified: true },
        {
          where: {
            id: isTokenVerified.id,
          },
        }
      );

      // return res.status(200).json({
      //   message: "User verified!"
      // })

      return res.redirect(
        `http://localhost:3000/verification-success?referral=${token}`
      );
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Server error",
      });
    }
  },
  resendVerificationEmail: async (req, res) => {
    try {
      const userId = req.token.id;

      const findUserById = await User.findByPk(userId);

      if (findUserById.is_verified) {
        return res.status(400).json({
          message: "User had been verified",
        });
      }

      const verificationToken = generateToken(
        {
          id: userId,
          isEmailVerification: true,
        },
        "1h"
      );

      const verificationLink = `http://localhost:2000/auth/verify/${verificationToken}`;

      const template = fs
        .readFileSync(__dirname + "/../templates/verify.html")
        .toString();

      const renderedTemplate = mustache.render(template, {
        username: findUserById.username,
        verify_url: verificationLink,
        full_name: findUserById.full_name,
      });

      await mailer({
        to: findUserById.email,
        subject: "Verify your account!",
        html: renderedTemplate,
      });

      return res.status(200).json({
        message: "Email sent",
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Server Error",
      });
    }
  },
  sendForgotPasswordEmail: async (req, res) => {
    try {
      const { email } = req.body;

      const findUser = await User.findOne({
        where: {
          email,
        },
      });

      const passwordToken = nanoid(40);

      await ForgotPasswordToken.update(
        { is_valid: false },
        {
          where: {
            user_id: findUser.id,
            is_valid: true,
          },
        }
      );

      await ForgotPasswordToken.create({
        token: passwordToken,
        valid_until: moment().add(1, "hour"),
        is_valid: true,
        user_id: findUser.id,
      });

      const forgotPasswordLink = `http://localhost:3000/forgot-password?fp_token=${passwordToken}`;

      const template = fs
        .readFileSync(__dirname + "/../templates/forgot.html")
        .toString();

      const renderedTemplate = mustache.render(template, {
        username: findUser.username,
        forgot_password_url: forgotPasswordLink,
        full_name: findUser.full_name,
      });

      await mailer({
        to: findUser.email,
        subject: "Forgot password!",
        html: renderedTemplate,
      });

      return res.status(201).json({
        message: "Email has been sent",
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Server error",
      });
    }
  },
  changeUserForgotPassword: async (req, res) => {
    try {
      const { password, forgotPasswordToken } = req.body;

      const findToken = await ForgotPasswordToken.findOne({
        where: {
          token: forgotPasswordToken,
          is_valid: true,
          valid_until: {
            [Op.gt]: moment().utc(),
          },
        },
      });

      if (!findToken) {
        return res.status(400).json({
          message: "Invalid token",
        });
      }

      const hashedPassword = bcrypt.hashSync(password, 5);

      await Password.update(
        { password: hashedPassword },
        {
          where: {
            user_id: findToken.user_id,
          },
        }
      );

      return res.status(200).json({
        message: "Change password success",
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Server error",
      });
    }
  },
};

// TODO: Email for verification

module.exports = authControllers;
