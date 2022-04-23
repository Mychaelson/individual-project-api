const { Sequelize } = require("sequelize");
const mysqlConfig = require("../config/database");

// initialization of sequelize (orm for mysql)
const sequelize = new Sequelize({
  username: mysqlConfig.MYSQL_USERNAME,
  password: mysqlConfig.MYSQL_PASSWORD,
  database: mysqlConfig.MYSQL_DB_NAME,
  port: 3306,
  dialect: "mysql",
  logging: false,
});

// models
const Post = require("../models/post")(sequelize);
const User = require("../models/user")(sequelize);
const Password = require("../models/password")(sequelize);
const Like = require("../models/like")(sequelize);
const Comment = require("../models/comment")(sequelize);
const ForgotPasswordToken = require("../models/forgot_password_token")(
  sequelize
);

// relationship of the models

// between post and the owner of the post (1: M)
Post.belongsTo(User, {
  foreignKey: "user_id",
  as: "user_posts",
  onDelete: "CASCADE",
});
User.hasMany(Post, {
  foreignKey: "user_id",
  as: "user_posts",
  onDelete: "CASCADE",
});

// between the user and the password for the auth purposes (1:1)
Password.belongsTo(User, { foreignKey: "user_id" });
User.hasOne(Password, { foreignKey: "user_id" });

// between the post and the user that have like the post  (M:M / super many to many)
Post.belongsToMany(User, {
  through: Like,
  foreignKey: "post_id",
  as: "post_like",
});
User.belongsToMany(Post, {
  through: Like,
  foreignKey: "user_id",
  as: "post_like",
});
User.hasMany(Like, { foreignKey: "user_id" });
Like.belongsTo(User, { foreignKey: "user_id" });
Post.hasMany(Like, { foreignKey: "post_id", onDelete: "CASCADE" });
Like.belongsTo(Post, { foreignKey: "post_id", onDelete: "CASCADE" });

// between the comment and the post also with the people that comment (1:M)
Comment.belongsTo(Post, { foreignKey: "post_id", onDelete: "CASCADE" });
Post.hasMany(Comment, { foreignKey: "post_id", onDelete: "CASCADE" });
Comment.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(Comment, { foreignKey: "user_id" });

// between forget password token and the user (1:M)
ForgotPasswordToken.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(ForgotPasswordToken, { foreignKey: "user_id" });

module.exports = {
  sequelize,
  Post,
  User,
  Comment,
  Like,
  Password,
  ForgotPasswordToken,
};
