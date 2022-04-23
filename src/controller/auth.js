const AuthService = require("../services/auth");

// the controllers is fuction as a responsed sender
// meaning that logic will be runned on their repective service and based on the respond of the service, the respond will be send accordingly
// there are three types of responds which are success, error, and redirect

const authControllers = {
  registerUser: async (req, res) => {
    try {
      // the req will also be send to let the service get the data on the request from front end
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
