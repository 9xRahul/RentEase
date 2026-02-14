const router = require("express").Router();
const controller = require("../controller/auth_controller");
const upload = require("../../../middleware/uploadMiddleware");

router.post("/register", upload.single("profilePhoto"), controller.register);
router.post("/login", controller.login);

module.exports = router;
