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

module.exports = router;
