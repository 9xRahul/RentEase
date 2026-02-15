const express = require("express");
const router = express.Router();

const controller = require("../controllers/propertyController");
const auth = require("../../../middleware/authMiddleware");

const upload = require("../../../middleware/multerMiddleware");

router.post(
  "/",
  auth,
  upload.array("photos", 10), // 🔥 MUST BE HERE
  controller.addProperty,
);
router.get("/", controller.getProperties);

module.exports = router;
