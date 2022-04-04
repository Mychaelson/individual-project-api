const router = require("express").Router();
const { postControllers } = require("../controller");
const fileUploader = require("../lib/uploader");
const { authorizedLoggedInUser } = require("../middleware/authMiddleware");

router.get("/", authorizedLoggedInUser, postControllers.getAllPost);
router.post(
  "/",
  authorizedLoggedInUser,
  fileUploader({
    destinationFolder: "posts",
    fileType: "image",
    prefix: "POST",
  }).single("post_image_file"),
  postControllers.createNewPost
);
router.patch("/:id", authorizedLoggedInUser, postControllers.editPost);
router.delete("/:id", authorizedLoggedInUser, postControllers.deletePost);
router.post("/:post_id/likes/:user_id", postControllers.incrementPostLikes);
router.delete("/:post_id/likes/:user_id", postControllers.decrementPostLikes);

module.exports = router;
