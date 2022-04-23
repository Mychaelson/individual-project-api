const router = require("express").Router();
const { postControllers } = require("../controller");
const fileUploader = require("../lib/uploader");
const { authorizedLoggedInUser } = require("../middleware/authMiddleware");

router.get("/", authorizedLoggedInUser, postControllers.getAllPost);

router.get("/getPostWithoutLike", postControllers.getAllPostWithoutLike);

// for the post, the user will need to upload a file which need to be kept at the API
// the incloming file will be handle bay the middleware called file uploaded
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
router.get(
  "/userLikedPost",
  authorizedLoggedInUser,
  postControllers.checkUserLikedPost
);
router.post(
  "/:post_id/likes/:user_id",
  authorizedLoggedInUser,
  postControllers.incrementPostLikes
);
router.delete(
  "/:post_id/likes/:user_id",
  authorizedLoggedInUser,
  postControllers.decrementPostLikes
);

router.get(
  "/get_post_user_liked/:user_id",
  authorizedLoggedInUser,
  postControllers.getPostUserLiked
);

module.exports = router;
