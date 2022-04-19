const uploadFileDomain = require("../../config/uploadFile");
const { Post, User, Comment, Like } = require("../../lib/sequelize");
const Service = require("../service");
const fs = require("fs");

class PostService extends Service {
  static getAllPost = async (req) => {
    try {
      const { _limit = 10, _page = 1, _sortBy = "", _sortDir = "" } = req.query;

      delete req.query._limit;
      delete req.query._page;
      delete req.query._sortBy;
      delete req.query._sortDir;

      const result = await Post.findAndCountAll({
        where: {
          ...req.query,
        },
        limit: _limit ? parseInt(_limit) : undefined,
        offset: (_page - 1) * _limit,
        include: [
          {
            model: User,
            as: "user_posts",
          },
          {
            model: Comment,
            include: User,
            limit: 5,
            order: [["createdAt", "DESC"]],
          },
          {
            model: User,
            as: "post_like",
            where: {
              id: req?.token?.id || 0,
            },
            required: false,
          },
        ],
        distinct: true,
        order: _sortBy ? [[_sortBy, _sortDir]] : undefined,
      });

      if (!result.rows.length) {
        return this.handleError({
          statusCode: 400,
          message: "There are no post yet!",
        });
      }

      return this.handleSuccess({
        statusCode: 200,
        message: "Find all post!",
        data: result,
      });
    } catch (err) {
      console.log(err);
      return this.handleError({
        message: "Server Error",
        statusCode: 500,
      });
    }
  };

  static getPostWithoutLike = async (req) => {
    try {
      const result = await Post.findAndCountAll({
        where: {
          ...req.query,
        },
        include: [
          {
            model: User,
            as: "user_posts",
          },
          {
            model: Comment,
            include: User,
            limit: 5,
            order: [["createdAt", "DESC"]],
          },
        ],
        distinct: true,
      });

      if (!result.rows.length) {
        return this.handleError({
          statusCode: 400,
          message: "There are no post yet!",
        });
      }

      return this.handleSuccess({
        statusCode: 200,
        message: "Find all post!",
        data: result,
      });
    } catch (err) {
      console.log(err);
      return this.handleError({
        message: "Server Error",
        statusCode: 500,
      });
    }
  };

  static createNewPost = async (req) => {
    try {
      const { caption, location, user_id } = req.body;

      const uploadeFileDomain = uploadFileDomain;
      const filePath = `post_images`;
      const { filename } = req.file;

      const newPost = await Post.create({
        image_url: `${uploadeFileDomain}/${filePath}/${filename}`,
        caption,
        location,
        user_id: req.token.id,
      });

      return this.handleSuccess({
        message: "Create Post Successful!",
        statusCode: 201,
      });
    } catch (err) {
      fs.unlinkSync(__dirname + "/../../public/posts/" + req.file.filename);
      console.log(err);
      return this.handleError({
        message: "Server Error",
        statusCode: 500,
      });
    }
  };

  static editPost = async (req) => {
    try {
      const { id } = req.params;

      const editPost = await Post.update(
        {
          ...req.body,
        },
        {
          where: {
            id,
            user_id: req.token.id,
          },
        }
      );

      return this.handleSuccess({
        message: "Post Edited!",
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

  static deletePost = async (req) => {
    try {
      const { id } = req.params;

      const findPost = await Post.findOne({
        where: {
          id,
        },
      });

      const deletePost = await Post.destroy({
        where: {
          id,
          user_id: req.token?.id,
        },
      });

      const postImgUrl = findPost.dataValues.image_url;
      const postImgSplitName = postImgUrl.split("/");

      fs.unlinkSync(
        __dirname +
          "/../../public/posts/" +
          postImgSplitName[postImgSplitName.length - 1]
      );

      return this.handleSuccess({
        message: "Post Deleted!",
      });
    } catch (err) {
      console.log(err);
      return this.handleError({
        message: "Server Error",
        statusCode: 500,
      });
    }
  };

  static checkUserLikedPost = async (req) => {
    try {
      const { post_id } = req.query;
      const user_id = req.token.id;

      const userHasLikedPost = await Like.findOne({
        where: {
          post_id,
          user_id,
        },
      });

      if (!userHasLikedPost) {
        return this.handleError({
          message: "User have not like the post",
          statusCode: "400",
        });
      }

      return this.handleSuccess({
        message: "User has Liked the post",
        statusCode: 200,
        data: userHasLikedPost,
      });
    } catch (err) {
      console.log(err);
      return this.handleError({
        message: "Server Error",
        statusCode: 500,
      });
    }
  };

  static incrementPostLikes = async (req) => {
    try {
      const { post_id, user_id } = req.params;

      const hasUserLikeThePost = await Like.findOne({
        where: {
          user_id: req.token.id,
          post_id,
        },
      });

      if (hasUserLikeThePost) {
        return this.handleError({
          message: "User has liked the post",
          statusCode: 400,
        });
      }

      const likePost = await Like.create({
        post_id,
        user_id: req.token.id,
      });

      await Post.increment({ like_count: 1 }, { where: { id: post_id } });

      return this.handleSuccess({
        message: "Like Added!",
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

  static decrementPostLikes = async (req) => {
    try {
      const { user_id, post_id } = req.params;

      const hasUserLikeThePost = await Like.findOne({
        where: {
          user_id: req.token.id,
          post_id,
        },
      });

      if (!hasUserLikeThePost) {
        return this.handleError({
          message: "User have not like the post!",
          statusCode: 400,
        });
      }

      const deleteLike = await Like.destroy({
        where: {
          user_id: req.token.id,
          post_id,
        },
      });

      await Post.increment({ like_count: -1 }, { where: { id: post_id } });

      return this.handleSuccess({
        message: "Like Deleted!",
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

  static getPostUserLiked = async (req) => {
    try {
      const { user_id } = req.params;

      const LikedPost = await Like.findAndCountAll({
        where: {
          user_id,
        },
        include: Post,
      });

      if (!LikedPost) {
        return this.handleError({
          message: "You haven't like any post",
          statusCode: 400,
        });
      }

      return this.handleSuccess({
        message: "Post User has liked",
        statusCode: 200,
        data: LikedPost,
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

module.exports = PostService;
