const { DataTypes } = require("sequelize");

const Password = (sequelize) => {
  return sequelize.define("password", {
    password: {
      type: DataTypes.STRING,
    },
  });
};

module.exports = Password;
