const { Op } = require("sequelize");
const { Password, User, ForgotPasswordToken } = require("../../lib/sequelize");
const Service = require("../service");
const bcrypt = require("bcrypt");
const { generateToken, verifyToken } = require("../../lib/jwt");
const fs = require("fs");
const mustache = require("mustache");
const mailer = require("../../lib/mailer");
const { nanoid } = require("nanoid");
const moment = require("moment");

class AuthService extends Service {
  static loginUser = async (req) => {
    try {
      const { credential, password } = req.body;

      // it will recieve either an email or username, and it will be set as credential
      // to find the user, the or operator will be use

      const findUser = await User.findOne({
        where: {
          [Op.or]: [{ username: credential }, { email: credential }],
        },
        include: Password,
      });

      if (!findUser) {
        return this.handleError({
          statusCode: 400,
          message: "Username or Password is wrong",
        });
      }

      //  if the user based on the credential exist, the password will be compared
      const isPasswordCorrect = bcrypt.compareSync(
        password,
        findUser.password.password
      );

      if (!isPasswordCorrect) {
        return this.handleError({
          statusCode: 400,
          message: "Username or Password is wrong",
        });
      }

      delete findUser.dataValues.password;

      // then if password is true, token and the user data will be send to front end trough controllers

      const token = generateToken({ id: findUser.id });

      return this.handleSuccess({
        data: {
          findUser,
          token,
        },
        message: "User Logged In",
        statusCode: 200,
      });
    } catch (err) {
      console.log(err);
      return this.handleError({
        message: "Server Error",
        statusCode: 500,
      });
    }
  };

  static registerUser = async (req) => {
    try {
      const { username, email, password } = req.body;

      //  the username and email must be unique, therefore there will be a proccess of checking wheter the email or username has already existed

      const isUsernameAndEmailTaken = await User.findOne({
        where: {
          [Op.or]: [{ username }, { email }],
        },
      });

      if (isUsernameAndEmailTaken) {
        return this.handleError({
          statusCode: 400,
          message: "Username or Email has Been Taken",
        });
      }

      // if username or email doesn't exist, the password will be hashed and created in the database
      const hashedPassword = bcrypt.hashSync(password, 5);

      const registerUser = await User.create({
        username,
        email,
      });

      const addUserPassword = await Password.create({
        password: hashedPassword,
        user_id: registerUser.id,
      });

      // Verification email
      // verification email will also be send to the user based in the registed email
      const verificationToken = generateToken(
        {
          id: registerUser.id,
          isEmailVerification: true,
        },
        "1h"
      );

      const verificationLink = `http://localhost:2000/auth/verify/${verificationToken}`;

      const template = fs
        .readFileSync(__dirname + "/../../templates/verify.html")
        .toString();

      // the mustache is use to edit the html which is used as a email template which contain the username and a link
      const renderedTemplate = mustache.render(template, {
        username,
        verify_url: verificationLink,
      });

      await mailer({
        to: email,
        subject: "Verify your account!",
        html: renderedTemplate,
      });

      return this.handleSuccess({
        message: "User Added, please check your email to verify your account",
        statusCode: 201,
      });
    } catch (err) {
      console.log(err);
      return this.handleError({
        message: "Server Error",
        statusCode: 500,
      });
    }
  };

  static keepLogin = async (req) => {
    try {
      const { token } = req;

      // token will be receive and regenerated to be send along with the used data based on the user id in the token
      // use to relogin the user

      const renewedToken = generateToken({ id: token.id });

      const findUser = await User.findByPk(token.id);

      delete findUser.dataValues.password;

      return this.handleSuccess({
        statusCode: 200,
        message: "Renewed user token",
        data: {
          User: findUser,
          token: renewedToken,
        },
      });
    } catch (err) {
      console.log(err);
      return this.handleError({
        message: "Server Error",
        statusCode: 500,
      });
    }
  };

  static verifyUser = async (req) => {
    try {
      // to change the user verifiedn status, the req will include a valid token and is an verification token
      const { token } = req.params;

      const isTokenVerified = await verifyToken(token);

      if (!isTokenVerified || !isTokenVerified.isEmailVerification) {
        return this.handleError({ message: "Token invalid!", statusCode: 400 });
      }

      // if the token valid, the status will be change to verify and the user will be redirected to a page
      await User.update(
        { is_verified: true },
        {
          where: {
            id: isTokenVerified.id,
          },
        }
      );

      return this.handleRedirect(
        `http://localhost:3000/verification-success?referral=${token}`
      );
    } catch (err) {
      console.log(err);
      return this.handleError({
        message: "Server Error",
        statusCode: 500,
      });
    }
  };

  static resendVerificationEmail = async (req) => {
    try {
      // this process is similar to the registration function with out the registration
      const userId = req.token.id;

      const findUserById = await User.findByPk(userId);

      if (findUserById.is_verified) {
        return this.handleError({
          message: "User had been verified",
          statusCode: 400,
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
        .readFileSync(__dirname + "/../../templates/verify.html")
        .toString();

      const renderedTemplate = mustache.render(template, {
        username: findUserById.username,
        verify_url: verificationLink,
      });

      await mailer({
        to: findUserById.email,
        subject: "Verify your account!",
        html: renderedTemplate,
      });

      return this.handleSuccess({
        statusCode: 200,
        message: "Email sent!",
      });
    } catch (err) {
      console.log(err);
      return this.handleError({
        message: "Server Error",
        statusCode: 500,
      });
    }
  };

  static sendForgotPasswordEmail = async (req) => {
    try {
      const { email } = req.body;
      // the user will inout their email and the email will be check

      const findUser = await User.findOne({
        where: {
          email,
        },
      });

      if (!findUser) {
        return this.handleError({
          statusCode: 400,
          message: "No User Found!",
        });
      }

      // if the email is correct, then a token will be generated and all the previous token will be invalidate

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

      // then an email will be sent, contaning a link to a page to reset password

      const forgotPasswordLink = `http://localhost:3000/reset-password?fp_token=${passwordToken}`;

      const template = fs
        .readFileSync(__dirname + "/../../templates/forgot.html")
        .toString();

      const renderedTemplate = mustache.render(template, {
        username: findUser.username,
        forgot_password_url: forgotPasswordLink,
      });

      await mailer({
        to: findUser.email,
        subject: "Forgot password!",
        html: renderedTemplate,
      });

      return this.handleSuccess({
        message: "Email has been sent!",
        statusCode: 200,
      });
    } catch (err) {
      console.log(err);
      return this.handleError({
        message: "Server Error",
        statusCode: 500,
      });
    }
  };

  static changeUserForgotPassword = async (req) => {
    try {
      const { password, forgotPasswordToken } = req.body;

      // the password and a token will be recieve through body, then the token will be ckeck whether it is valid or not

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
        // return res.status(400).json({
        //   message: "Invalid token",
        // });

        return this.handleError({
          statusCode: 400,
          message: "Invalid token",
        });
      }

      // if the token is valid, then the password will be hashed and updated based on the user id gotten from the token

      const hashedPassword = bcrypt.hashSync(password, 5);

      await Password.update(
        { password: hashedPassword },
        {
          where: {
            user_id: findToken.user_id,
          },
        }
      );

      // return res.status(200).json({
      //   message: "Change password success",
      // });

      return this.handleSuccess({
        statusCode: 200,
        message: "Change password success!",
      });
    } catch (err) {
      console.log(err);
      return this.handleError({
        message: "Server Error",
        statusCode: 500,
      });
    }
  };
}

module.exports = AuthService;
