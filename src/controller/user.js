const { User, Post } = require("../lib/sequelize");
const fs = require("fs");

const userControllers = {
  getUsers: async (req, res) => {
    try {
      const { user_id } = req.query;

      const getUserProfile = await User.findOne({
        where: {
          id: user_id,
        },
        // include: [
        //   {
        //     model: Post,
        //     where: {
        //       user_id,
        //     },
        //   },
        // ],
      });

      if (getUserProfile === null) {
        return res.status(400).json({
          message: "User not found",
        });
      }

      const userPost = await Post.findAll({
        where: {
          user_id,
        },
      });

      // need to return the user taht include the post

      return res.status(200).json({
        message: "User Found",
        profile: getUserProfile,
        posts: userPost,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Server Error",
      });
    }
  },
  editUser: async (req, res) => {
    try {
      const { id } = req.params;
      const { full_name, bio, username } = req.body;

      const uploadeFileDomain = process.env.UPLOAD_FILE_DOMAIN;
      const filePath = `avatar_images`; // based on the middleware
      const { filename } = req.file;

      let isUsernameUnique;

      if (username) {
        isUsernameUnique = await User.findOne({
          where: {
            username,
          },
        });
      }

      if (isUsernameUnique) {
        return res.status(400).json({
          message: "Username has been taken",
        });
      }

      const editProfile = await User.update(
        {
          avatar_image: `${uploadeFileDomain}/${filePath}/${filename}`, // klo ada bru masuk
          full_name,
          bio,
          username,
        },
        {
          where: {
            id,
          },
        }
      );

      res.status(200).json({
        message: "profile successfully edited",
      });
    } catch (err) {
      fs.unlinkSync(__dirname + "/../public/posts/" + req.file.filename);
      console.log(err);
      return res.status(500).json({
        message: "Server Error",
      });
    }
  },
};

module.exports = userControllers;
