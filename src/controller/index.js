const postControllers = require("./post");
const authControllers = require("./auth");
const commentControllers = require("./comment");
const userControllers = require("./user");

// the controllers is fuction as a responsed sender
// meaning that logic will be runned on their repective service and based on the respond of the service, the respond will be send accordingly
// there are three types of responds which are success, error, and redirect

module.exports = {
  postControllers,
  authControllers,
  commentControllers,
  userControllers,
};
