const express = require("express");
const app = express();
const shoppingRoutes = require("./routes/shopping");
const ExpressError = require("../expressError");

const morgan = require("morgan");
app.use(morgan("dev"));
app.use(express.json());
app.use("/shopping", shoppingRoutes);

// 404 Handler
app.use(function (req, res, next) {
  return new ExpressError("Page not found.", 404);
});

// general error handler middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500);

  return res.json({
    error: err.msg,
  });
});

module.exports = app;
