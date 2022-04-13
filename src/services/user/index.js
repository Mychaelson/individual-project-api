const { User, Post } = require("../../lib/sequelize");
const Service = require("../service");

class UserService extends Service {
  static getUser = async (req) => {
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
        order: [[{ model: Post, as: "user_posts" }, "createdAt", "DESC"]], // ini masih salah
      });

      return this.handleSuccess({
        message: "User Found!",
        statusCode: 200,
        data: getUserProfile,
      });
    } catch (err) {
      console.log(err);
      return this.handleError({
        message: "Server Error",
        statusCode: 500,
      });
    }
  };

  static editUser = async (req) => {
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
        return this.handleError({
          message: "Username has been taken",
          statusCode: 400,
        });
      }

      const editProfile = await User.update(
        {
          avatar_img: req.file
            ? `${uploadeFileDomain}/${filePath}/${filename}`
            : undefined,
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

      return this.handleSuccess({
        message: "Profile Successfully Edited!",
        statusCode: 200,
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

  static getMyProfile = async (req) => {
    try {
      const { id } = req.token;

      const myProfileData = await User.findByPk(id, {
        include: [
          {
            model: Post,
            as: "user_posts",
          },
        ],
        order: [[{ model: Post, as: "user_posts" }, "createdAt", "DESC"]],
      });

      return this.handleSuccess({
        message: "User Found!",
        statusCode: 200,
        data: myProfileData,
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

module.exports = UserService;
