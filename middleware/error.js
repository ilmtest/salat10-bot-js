const Sentry = require("@sentry/node");

const errorHandler = (err, req, res, next) => {
  let error = { ...err, message: err.message };
  console.error(err.stack);

  Sentry.captureException(err);

  res
    .status(error.statusCode || 500)
    .json({ success: false, error: error.message || "Server error" });
};

module.exports = errorHandler;
