const router = require("express").Router();

router.use("/users", require("../modules/user/routes/userRoutes"));
router.use("/properties", require("../modules/property/routes/propertyRoutes"));

module.exports = router;
