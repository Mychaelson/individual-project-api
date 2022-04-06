const { commentControllers } = require("../controller");
const { authorizedLoggedInUser } = require("../middleware/authMiddleware");

const router = require("express").Router();

router.get("/", commentControllers.getAllComment);
router.post("/", authorizedLoggedInUser, commentControllers.postNewComment);

module.exports = router;
