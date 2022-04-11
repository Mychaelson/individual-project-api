const { Post, User, Comment, Like } = require("../lib/sequelize");
const serverErrorHandler = require("../lib/serverErrorHandler");
const fs = require("fs");
const uploadFileDomain = require("../config/uploadFile");

const postControllers = {
  getAllPost: async (req, res) => {
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
              id: req.token.id,
            },
            required: false,
          },
        ],
        distinct: true,
        order: _sortBy ? [[_sortBy, _sortDir]] : undefined,
      });

      if (!result.rows.length) {
        return res.status(400).json({
          message: "There are no post yet",
        });
      }

      return res.status(200).json({
        message: "find all post",
        result,
      });
    } catch (err) {
      serverErrorHandler(err, req, res);
    }
  },
  createNewPost: async (req, res) => {
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

      return res.status(200).json({
        message: "Post Successful",
      });
    } catch (err) {
      fs.unlinkSync(__dirname + "/../public/posts/" + req.file.filename);
      serverErrorHandler(err, req, res);
    }
  },
  editPost: async (req, res) => {
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

      return res.status(200).json({
        message: "Post Edited",
      });
    } catch (err) {
      serverErrorHandler(err, req, res);
    }
  },
  deletePost: async (req, res) => {
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
          "/../public/posts/" +
          postImgSplitName[postImgSplitName.length - 1]
      );

      res.status(200).json({
        message: "Post Deleted",
      });
    } catch (err) {
      serverErrorHandler(err, req, res);
    }
  },
  incrementPostLikes: async (req, res) => {
    try {
      const { post_id, user_id } = req.params;

      const hasUserLikeThePost = await Like.findOne({
        where: {
          user_id,
          post_id,
        },
      });

      if (hasUserLikeThePost) {
        return res.status(400).json({
          message: "User has liked the post",
        });
      }

      const likePost = await Like.create({
        post_id,
        user_id: req.token.id,
      });

      await Post.increment({ like_count: 1 }, { where: { id: post_id } });

      return res.status(200).json({
        message: "Like added",
      });
    } catch (err) {
      serverErrorHandler(err, req, res);
    }
  },
  decrementPostLikes: async (req, res) => {
    try {
      const { user_id, post_id } = req.params;

      const hasUserLikeThePost = await Like.findOne({
        where: {
          user_id,
          post_id,
        },
      });

      if (!hasUserLikeThePost) {
        return res.status(400).json({
          message: "User have not like the post",
        });
      }

      const deleteLike = await Like.destroy({
        where: {
          user_id: req.token.id,
          post_id,
        },
      });

      await Post.increment({ like_count: -1 }, { where: { id: post_id } });

      return res.status(200).json({
        message: "Like Deleted",
      });
    } catch (err) {
      serverErrorHandler(err, req, res);
    }
  },
  // getAllUserthatLikeThePost: async (req, res) => {},
};

module.exports = postControllers;
