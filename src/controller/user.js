const { User, Post } = require("../lib/sequelize");
const fs = require("fs");
const serverErrorHandler = require("../lib/serverErrorHandler");

const userControllers = {
  getUsers: async (req, res) => {
    try {
      const { user_id } = req.query;

      const getUserProfile = await User.findOne({
        where: {
          id: user_id,
        },
        include: [
          {
            model: Post,
            as: "user_posts",
          },
        ],
      });

      return res.status(200).json({
        message: "User Found",
        profile: getUserProfile,
        // posts,
      });
    } catch (err) {
      serverErrorHandler(err, req, res);
    }
  },
  editUser: async (req, res) => {
    try {
      const { id } = req.params;
      const { full_name, bio, username } = req.body;

      const uploadeFileDomain = process.env.UPLOAD_FILE_DOMAIN;
      const filePath = `avatar_images`; // based on the middleware
      const filename = req.file?.filename;

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
          avatar_img: req.file
            ? `${uploadeFileDomain}/${filePath}/${filename}`
            : undefined, // klo ada bru masuk
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
      serverErrorHandler(err, req, res);
    }
  },
  getMyProfile: async (req, res) => {
    try {
      const { id } = req.token;

      const myProfileData = await User.findByPk(id, {
        include: [
          {
            model: Post,
            as: "user_posts",
          },
        ],
      });

      return res.status(200).json({
        message: "User Found",
        profile: myProfileData,
      });
    } catch (err) {
      serverErrorHandler(err, req, res);
    }
  },
};

module.exports = userControllers;
