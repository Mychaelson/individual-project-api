const { commentControllers } = require("../controller");

const router = require("express").Router();

router.get("/", commentControllers.getAllComment);
router.post("/", commentControllers.postNewComment);

module.exports = router;
