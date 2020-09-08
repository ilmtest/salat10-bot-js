const calculate = require('../utils/calculator');
const SalatNames = require('../utils/SalatNames');

const locationHandler = (bot) => {
    bot.on('location', async ({ location, chat, message_id: messageId }) => {
        bot.sendChatAction(chat.id, 'typing');
        const { latitude, longitude } = location;
        console.log(`Received new coordinates: (${latitude}, ${longitude})`);
        const result = await calculate(SalatNames, latitude, longitude);
        bot.sendMessage(chat.id, result, {
            reply_to_message_id: messageId,
        });
    });
};

module.exports = locationHandler;
