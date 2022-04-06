const router = require("express").Router();
const { authControllers } = require("../controller");
const { authorizedLoggedInUser } = require("../middleware/authMiddleware");

router.post("/register", authControllers.registerUser);
router.post("/login", authControllers.loginUser);
router.get("/refresh-token", authorizedLoggedInUser, authControllers.keepLogin);

module.exports = router;
