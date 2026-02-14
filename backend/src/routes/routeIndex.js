const router = require("express").Router();

router.use("/users", require("../modules/user/routes/userRoutes"));


module.exports = router;
