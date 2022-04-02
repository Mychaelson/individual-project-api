module.exports = (err) => {
  console.log(err);
  return res.status(500).json({
    message: "Server Error",
  });
};
