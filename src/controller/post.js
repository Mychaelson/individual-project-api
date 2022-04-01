const { Post, User, Comment } = require("../lib/sequelize");
const errorHandler = require("../lib/serverErrorHandler");

const postControllers = {
  getAllPost: async (req, res) => {},
  createNewPost: async (req, res) => {},
  editPost: async (req, res) => {},
  deletePost: async (req, res) => {},
};

module.exports = postControllers;
