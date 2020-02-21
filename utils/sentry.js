const devSentry = {
  captureException: console.error,
  init: () => {}
};

const Sentry =
  process.env.NODE_ENV === "development" ? devSentry : require("@sentry/node");
module.exports = Sentry;
