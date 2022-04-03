const router = require("express").Router();
const { postControllers } = require("../controller");
const fileUploader = require("../lib/uploader");

router.get("/", postControllers.getAllPost);
router.post(
  "/",
  fileUploader({
    destinationFolder: "posts",
    fileType: "image",
    prefix: "POST",
  }).single("post_image_file"),
  postControllers.createNewPost
);
router.patch("/:id", postControllers.editPost);
router.delete("/:id", postControllers.deletePost);
router.post("/:post_id/likes/:user_id", postControllers.incrementPostLikes);
router.delete("/:post_id/likes/:user_id", postControllers.decrementPostLikes);

module.exports = router;
