const { DataTypes } = require("sequelize");

const Post = (sequelize) => {
  return sequelize.define("post", {
    image_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    caption: {
      type: DataTypes.STRING,
    },
    location: {
      type: DataTypes.STRING,
    },
    like_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  });
};

module.exports = Post;
