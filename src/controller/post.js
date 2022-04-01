const { Post, User, Comment } = require("../lib/sequelize");
const errorHandler = require("../lib/serverErrorHandler");

const postControllers = {
  getAllPost: async (req, res) => {
    try {
      const { _limit = 10, _page = 1 } = req.query;

      delete req.query._limit;
      delete req.query._page;

      const result = await Post.findAndCountAll({
        where: {
          ...req.query,
        },
        limit: _limit ? parseInt(_limit) : undefined,
        offset: (_page - 1) * _limit,
        include: [
          {
            model: User,
          },
          {
            model: Comment,
            include: User,
          },
        ],
        distinct: true,
      });

      return res.status(200).json({
        message: "find all post",
        result,
      });
    } catch (err) {
      errorHandler(err);
    }
  },
  createNewPost: async (req, res) => {},
  editPost: async (req, res) => {},
  deletePost: async (req, res) => {},
};

module.exports = postControllers;
