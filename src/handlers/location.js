const { calculate, formatAsText } = require('@ilmtest/salat10-sdk');

const locationHandler = (bot) => {
    bot.on('location', async ({ location, chat, message_id: messageId }) => {
        bot.sendChatAction(chat.id, 'typing');
        const { latitude, longitude } = location;
        console.log(`Received new coordinates: (${latitude}, ${longitude})`);
        const result = calculate(latitude, longitude);
        const data = await formatAsText(result, latitude, longitude);
        bot.sendMessage(chat.id, data, {
            reply_to_message_id: messageId,
        });
    });
};

module.exports = locationHandler;
