const router = require("express").Router();
const { authControllers } = require("../controller");

router.post("/register", authControllers.registerUser);
router.post("/login", authControllers.loginUser);

module.exports = router;
