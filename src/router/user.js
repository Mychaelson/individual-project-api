const { userControllers } = require("../controller");
const fileUploader = require("../lib/uploader");
const { authorizedLoggedInUser } = require("../middleware/authMiddleware");

const router = require("express").Router();

router.get("/", userControllers.getUsers);
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
