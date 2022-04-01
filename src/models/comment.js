const { DataTypes } = require("sequelize");

const Comment = (sequelize) => {
  return sequelize.define("comment", {
    comment: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
};

module.exports = Comment;
