const Sentry = require('@sentry/node');

const onError = (err) => {
    console.error('Exception', err);

    Sentry.captureException(err);
    Sentry.flush();
};

const errorHandler = (bot) => {
    bot.on('error', onError);
    bot.on('webhook_error', onError);
};

module.exports = errorHandler;
