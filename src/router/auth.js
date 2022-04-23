const router = require("express").Router();
const { authControllers } = require("../controller");
const { authorizedLoggedInUser } = require("../middleware/authMiddleware");

// the router filter the type of the request and send them to controllers
// some of the reuqest will need a token to access the endpoint
//  it is protected by the middleware called authorizeLoggedinUser

// the auth contorllers is function as a endpoint for request regarding the authorization such as register, login even forgot password
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
