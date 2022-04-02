const router = require("express").Router();
const { userControllers } = require("../controller");

router.get("/", userControllers.getAllUser);
router.post("/", userControllers.createNewUser);
router.patch("/:id", userControllers.editUser);

module.exports = router;
