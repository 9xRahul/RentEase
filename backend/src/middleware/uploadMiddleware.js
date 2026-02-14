const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { files: 10 },
});

module.exports = upload;
