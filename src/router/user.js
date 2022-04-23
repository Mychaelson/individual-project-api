const { userControllers } = require("../controller");
const fileUploader = require("../lib/uploader");
const { authorizedLoggedInUser } = require("../middleware/authMiddleware");

const router = require("express").Router();

router.get("/", userControllers.getUsers);

// the profile picture uploaded by the user will be handled by fileuploader middleware
router.patch(
  "/:id",
  fileUploader({
    destinationFolder: "profile_pictures",
    fileType: "image",
    prefix: "AVATAR",
  }).single("avatar_image_file"),
  userControllers.editUser
);

router.get("/my-profile", authorizedLoggedInUser, userControllers.getMyProfile);

module.exports = router;
