const { Post, User, Comment, Like } = require("../lib/sequelize");
const serverErrorHandler = require("../lib/serverErrorHandler");
const fs = require("fs");

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

      // console.log(result);

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
      // serverErrorHandler(err);
      console.log(err);
      return res.status(500).json({
        message: "Server Error",
      });
    }
  },
  createNewPost: async (req, res) => {
    try {
      const { caption, location, user_id } = req.body;

      const uploadeFileDomain = process.env.UPLOAD_FILE_DOMAIN;
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
      // serverErrorHandler(err);
      console.log(err);
      return res.status(500).json({
        message: "Server Error",
      });
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
      console.log(err);
      return res.status(500).json({
        message: "Server Error",
      });
    }
  },
  deletePost: async (req, res) => {
    try {
      const { id } = req.params;

      const deletePost = await Post.destroy({
        where: {
          id,
          user_id: req.token.id,
        },
      });

      res.status(200).json({
        message: "Post Deleted",
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Server Error",
      });
    }
  },
  incrementPostLikes: async (req, res) => {
    try {
      const { post_id, user_id } = req.params;

      const [likedPost, createLike] = await Like.findOrCreate({
        where: {
          post_id,
          user_id,
        },
      });

      if (!createLike) {
        return res.status(400).json({
          message: "User has liked the post",
        });
      }

      await Post.increment({ like_count: 1 }, { where: { id: post_id } });

      return res.status(200).json({
        message: "Like added",
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Server Error",
      });
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
          user_id,
          post_id,
        },
      });

      await Post.increment({ like_count: -1 }, { where: { id: post_id } });

      return res.status(200).json({
        message: "Like Deleted",
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Server Error",
      });
    }
  },
  // getAllUserthatLikeThePost: async (req, res) => {},
};

module.exports = postControllers;
