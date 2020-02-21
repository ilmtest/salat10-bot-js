require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");
const express = require("express");

const {
  BOT_API_KEY,
  PORT = 5000,
  SENTRY_DSN,
  HEROKU_APP_URL,
  NODE_ENV
} = process.env;

const IS_DEV = NODE_ENV === "development";
const Sentry = require("./utils/sentry");

Sentry.init({ dsn: SENTRY_DSN });

const bot = new TelegramBot(BOT_API_KEY, {
  polling: IS_DEV
});

if (!IS_DEV) {
  bot.setWebHook(`${HEROKU_APP_URL}/bot${BOT_API_KEY}`);
}

bot.on("error", error => Sentry.captureException(error));
bot.on("webhook_error", error => Sentry.captureException(error));

const app = express();
app.use(require("helmet")());
app.use(express.json()); // body parser

if (IS_DEV) {
  app.use(require("morgan")("dev"));
}

app.use("/api/v1/calculate", require("./routes/calculate"));
app.use(require("./middleware/error")); // error handler

app.post(`/bot${BOT_API_KEY}`, (req, res) => {
  try {
    bot.processUpdate(req.body);
  } catch (error) {
    Sentry.captureException(error);
  }

  res.sendStatus(200);
});

const server = app.listen(
  PORT,
  console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`)
);

// handle unhandled promise rejections
process.on("unhandledRejection", err => {
  Sentry.captureException(err);
  console.error(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});

require("./telegram/user")(bot);
