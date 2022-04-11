const router = require("express").Router();
const { authControllers } = require("../controller");
const { authorizedLoggedInUser } = require("../middleware/authMiddleware");

router.post("/register", authControllers.registerUser);
router.post("/login", authControllers.loginUser);
router.get("/refresh-token", authorizedLoggedInUser, authControllers.keepLogin);

router.get("/verify/:token", authControllers.verifyUser);

// resend verification through email
router.post(
  "/resend-verification",
  authorizedLoggedInUser,
  authControllers.resendVerificationEmail
);

// forgot password
router.post("/forgot-password", authControllers.sendForgotPasswordEmail);
router.patch(
  "/change-password-forgot",
  authControllers.changeUserForgotPassword
);

module.exports = router;
