const { Post, User, Comment } = require("../lib/sequelize");
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
        user_id,
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
};

module.exports = postControllers;
