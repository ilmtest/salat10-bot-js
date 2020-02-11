const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const helmet = require("helmet");

// load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();
app.use(helmet());
app.use(express.json()); // body parser

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/v1/calculate", require("./routes/calculate"));

app.use(require("./middleware/error")); // error handler

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);

  // close server
  server.close(() => process.exit(1));
});
