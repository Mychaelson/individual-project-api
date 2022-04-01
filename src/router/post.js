const router = require("express").Router();
const { postControllers } = require("../controller");

router.get("/", postControllers.getAllPost);
router.post("/", postControllers.createNewPost);
router.patch(":id", postControllers.editPost);
router.delete(":id", postControllers.deletePost);

module.exports = router;
