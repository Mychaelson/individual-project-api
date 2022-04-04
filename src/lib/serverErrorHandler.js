const serverErrorHandler = (err) => {
  return (req, res) => {
    console.log(err);
    return res.status(500).json({
      message: "Server Error",
    });
  };
};

module.exports = serverErrorHandler;
