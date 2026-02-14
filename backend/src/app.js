const errorHandler = require("./middleware/errorMiddleware");
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", require("./routes/routeIndex"));

app.use((req, res) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: "Route not found",
  });
});

// 🔥 ERROR HANDLER MUST BE LAST
app.use(require("./middleware/errorMiddleware"));

module.exports = app;
