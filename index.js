/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const Sentry = require('@sentry/node');
const { isDevMode } = require('./src/utils/testing');
const myPackage = require('./package.json');

const { BOT_API_KEY, SENTRY_DSN } = process.env;

Sentry.init({
    dsn: SENTRY_DSN,
    beforeSend: (event) => {
        if (isDevMode) {
            return null;
        }

        return event;
    },
});
global.npm_package_version = myPackage.version;
global.npm_package_name = myPackage.name;
global.npm_package_author = myPackage.author;

console.log(`Starting v${global.npm_package_version} of ${global.npm_package_name}, isDevMode: ${isDevMode}`);

const initialize = async () => {
    console.log('Starting initilization...');

    const bot = new TelegramBot(BOT_API_KEY, {
        polling: isDevMode,
    });

    ['errorHandler', 'tracker', 'logger'].forEach((middleware) => {
        require(`./src/middlewares/${middleware}`)(bot);
    });

    ['address', 'start', 'help', 'bug'].forEach((command) => require(`./src/commands/${command}`)(bot));

    ['location', 'bugReply'].forEach((handler) => require(`./src/handlers/${handler}`)(bot));

    console.log('Initilization complete');

    return bot;
};

const onWebhookCalled = async (event, _, callback) => {
    const payload = JSON.parse(event.body); // get the data passed to us
    console.log('Payload received', payload);

    try {
        const bot = await initialize();
        bot.processUpdate(payload);
    } catch (err) {
        console.error('Error', err);
    }

    console.log('Bot update completed, returning 200');

    return callback(null, {
        statusCode: 200,
        body: '',
    });
};

if (isDevMode) {
    initialize();
}

exports.handler = onWebhookCalled;
