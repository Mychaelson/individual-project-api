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
const AuthService = require("../services/auth");

const authControllers = {
  registerUser: async (req, res) => {
    try {
      const serviceResult = await AuthService.registerUser(req);

      if (!serviceResult.success) throw serviceResult;

      return res.status(serviceResult.statusCode || 200).json({
        message: serviceResult.message,
        result: serviceResult.data,
      });
    } catch (err) {
      return res.status(err.statusCode || 500).json({
        message: err.message,
      });
    }
  },
  loginUser: async (req, res) => {
    try {
      const serviceResult = await AuthService.loginUser(req);

      if (!serviceResult.success) throw serviceResult;

      return res.status(serviceResult.statusCode || 200).json({
        message: serviceResult.message,
        result: serviceResult.data,
      });
    } catch (err) {
      return res.status(err.statusCode || 500).json({
        message: err.message,
      });
    }
  },
  keepLogin: async (req, res) => {
    try {
      const serviceResult = await AuthService.keepLogin(req);

      if (!serviceResult.success) throw serviceResult;

      return res.status(serviceResult.statusCode || 200).json({
        message: serviceResult.message,
        result: serviceResult.data,
      });
    } catch (err) {
      return res.status(err.statusCode || 500).json({
        message: err.message,
      });
    }
  },
  verifyUser: async (req, res) => {
    try {
      const serviceResult = await AuthService.verifyUser(req, res);

      if (!serviceResult.success) throw serviceResult;

      return res.redirect(serviceResult.url);
    } catch (err) {
      return res.status(err.statusCode || 500).json({
        message: err.message,
      });
    }
  },
  resendVerificationEmail: async (req, res) => {
    try {
      const serviceResult = await AuthService.resendVerificationEmail(req);

      if (!serviceResult.success) throw serviceResult;

      return res.status(serviceResult.statusCode || 200).json({
        message: serviceResult.message,
        result: serviceResult.data,
      });
    } catch (err) {
      return res.status(err.statusCode || 500).json({
        message: err.message,
      });
    }
  },
  sendForgotPasswordEmail: async (req, res) => {
    try {
      const serviceResult = await AuthService.sendForgotPasswordEmail(req);

      if (!serviceResult.success) throw serviceResult;

      return res.status(serviceResult.statusCode || 200).json({
        message: serviceResult.message,
        result: serviceResult.data,
      });
    } catch (err) {
      return res.status(err.statusCode || 500).json({
        message: err.message,
      });
    }
  },
  changeUserForgotPassword: async (req, res) => {
    try {
      const serviceResult = await AuthService.changeUserForgotPassword(req);

      if (!serviceResult.success) throw serviceResult;

      return res.status(serviceResult.statusCode || 200).json({
        message: serviceResult.message,
        result: serviceResult.data,
      });
    } catch (err) {
      return res.status(err.statusCode || 500).json({
        message: err.message,
      });
    }
  },
};

module.exports = authControllers;
