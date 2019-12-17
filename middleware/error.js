const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  let error = { ...err, message: err.message };
  console.log(err.stack.red);

  if (err.name === "CastError") {
    error = new ErrorResponse(`Resource with ID ${err.value} not found.`, 404);
  } else if (err.name === "MongoError" && err.code === 11000) {
    error = new ErrorResponse("Duplicate field value entered", 400);
  } else if (err.name === "ValidationError") {
    // mongoose, field value validation error
    const message = Object.values(err.errors).map(val => val.message);
    error = new ErrorResponse(message, 400);
  }

  res
    .status(error.statusCode || 500)
    .json({ success: false, error: error.message || "Server error" });
};

module.exports = errorHandler;
