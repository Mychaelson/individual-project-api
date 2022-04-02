const { DataTypes } = require("sequelize");

const User = (sequelize) => {
  return sequelize.define("user", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bio: {
      type: DataTypes.STRING,
    },
    avatar_img: {
      type: DataTypes.STRING,
    },
    is_verivied: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });
};

module.exports = User;
