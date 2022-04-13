const { Comment, User } = require("../../lib/sequelize");
const Service = require("../service");

class CommentService extends Service {
  static getAllComment = async (req) => {
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

      if (!allComment.rows.length) {
        return this.handleError({
          message: "There are no comment yet for this post!",
          statusCode: 400,
        });
      }

      return this.handleSuccess({
        message: "Find all comments",
        statusCode: 200,
        data: allComment,
      });
    } catch (err) {
      console.log(err);
      return this.handleError({
        message: "Server Error!",
        statusCode: 500,
      });
    }
  };

  static postNewComment = async (req) => {
    try {
      const { post_id, user_id, comment } = req.body;

      const newComment = await Comment.create({
        comment,
        post_id,
        user_id: req.token.id,
      });

      return this.handleSuccess({
        statusCode: 200,
        message: "Comment Posted!",
      });
    } catch (err) {
      console.log(err);
      return this.handleError({
        message: "Server Error!",
        statusCode: 500,
      });
    }
  };
}

module.exports = CommentService;
