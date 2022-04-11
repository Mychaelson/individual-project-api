const { Comment, User } = require("../lib/sequelize");
const serverErrorHandler = require("../lib/serverErrorHandler");

const commentControllers = {
  getAllComment: async (req, res) => {
    try {
      const { _limit = 5, _page = 1 } = req.query;

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
        order: [["createdAt", "DESC"]],
      });

      // console.log(allComment);

      if (!allComment.rows.length) {
        return res.status(400).json({
          message: "There are no comment yet for this post",
        });
      }

      return res.status(200).json({
        message: "Find all comments",
        result: allComment,
      });
    } catch (err) {
      serverErrorHandler(err, req, res);
    }
  },
  postNewComment: async (req, res) => {
    try {
      const { post_id, user_id, comment } = req.body;

      const newComment = await Comment.create({
        comment,
        post_id,
        user_id: req.token.id,
      });

      return res.status(200).json({
        message: "Comment posted",
      });
    } catch (err) {
      serverErrorHandler(err, req, res);
    }
  },
};

module.exports = commentControllers;
