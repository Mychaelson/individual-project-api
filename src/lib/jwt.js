const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET_KEY;

const generateToken = (payload, expiresIn = "2d") => {
  // this is to generate token and the payload will be the id of the user that is logging in
  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn,
  });

  return token;
};

const verifyToken = (token) => {
  const isVerified = jwt.verify(token, JWT_SECRET);
  // this will decode the token and return it
  return isVerified;
};

module.exports = {
  generateToken,
  verifyToken,
};
