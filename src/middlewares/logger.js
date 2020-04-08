const logMessage = (message) => {
    console.log('New message', message);
};

const logger = (bot) => {
    bot.on('message', logMessage);
};

module.exports = logger;
