require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");

const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");

const { BOT_API_KEY, HEROKU_APP_URL } = process.env;

const PORT = process.env.PORT || 5000;

const bot = new TelegramBot(BOT_API_KEY);
bot.setWebHook(`${HEROKU_APP_URL}/bot${BOT_API_KEY}`);

const app = express();
app.use(helmet());
app.use(express.json()); // body parser

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/v1/calculate", require("./routes/calculate"));
app.use(require("./middleware/error")); // error handler

app.post(`/bot${BOT_API_KEY}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

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

require("./telegram/user")(bot);

/*
bot.on("message", msg => {
  bot.sendMessage(msg.chat.id, "I am alive!");
});
*/
