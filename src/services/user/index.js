const { User, Post } = require("../../lib/sequelize");
const Service = require("../service");

class UserService extends Service {
  static getUser = async (req) => {
    try {
      const { user_id } = req.query;

      // to get user data, user id will be recived and search, it will also include the post, posted by the user based on the id

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

      // this is to set the name of the file, which the three variable combine can be use to access the file
      const uploadeFileDomain = process.env.UPLOAD_FILE_DOMAIN;
      const filePath = `avatar_images`; // based on the middleware
      const filename = req.file?.filename;

      // check if username has been taken
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

      // if username has not been taken, the user profile will be edited
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

      // the same concept as get profile, but this is using token, which means the data will belong to the user logged in

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
