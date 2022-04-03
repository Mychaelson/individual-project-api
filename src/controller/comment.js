const { Comment, User } = require("../lib/sequelize");

const commentControllers = {
  getAllComment: async (req, res) => {
    try {
      const { _limit = 10, _page = 1 } = req.query;

      delete req.query._limit;
      delete req.query._page;

      const allComment = await Comment.findAndCountAll({
        where: {
          ...req.query,
        },
        limit: _limit ? parseInt(_limit) : undefined,
        offset: (_page - 1) * _limit,
        include: {
          model: User,
        },
        distinct: true,
      });

      console.log(allComment);

      if (!allComment.rows.length) {
        return res.status(400).json({
          message: "There are no comment yet for this post",
        });
      }

      return res.status(200).json({
        message: "Find all comments",
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Server Error",
      });
    }
  },
  postNewComment: async (req, res) => {
    try {
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Server Error",
      });
    }
  },
};

module.exports = commentControllers;
