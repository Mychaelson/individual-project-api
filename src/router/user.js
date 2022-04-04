const { userControllers } = require("../controller");
const fileUploader = require("../lib/uploader");

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

module.exports = router;
