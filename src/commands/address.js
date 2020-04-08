const { calculate, formatAsText, reverseAddressLookup } = require('@ilmtest/salat10-sdk');

const addressHandler = (bot) => {
    bot.onText(/^\/address (.+)/, async (message, [, text]) => {
        const {
            chat: { id: chatId },
            message_id: messageId,
        } = message;
        bot.sendChatAction(chatId, 'typing');
        console.log(`Received new address: (${text})`);

        const { latitude, longitude, city } = await reverseAddressLookup(text);
        console.log(`Geocoded address: (${latitude}, ${longitude}, ${city})`);

        if (latitude && longitude && city) {
            console.log('Processing coordinates for reversed address');
            const result = calculate(latitude, longitude);
            const data = await formatAsText(result, latitude, longitude);

            bot.sendMessage(chatId, data, {
                reply_to_message_id: messageId,
            });
        } else {
            console.log('No address found');
            bot.sendMessage(
                chatId,
                '⚠️ No address found with that query. Please try something more accurate and be sure to include the city.',
                {
                    reply_to_message_id: messageId,
                },
            );
        }
    });

    bot.onText(/^\/address$/, (message) => {
        console.log('Empty address command received');
        bot.sendMessage(
            message.chat.id,
            '⚠️ You need to specify an exact location after the address command.\n\nFor example:\n/address 100 Queen St Toronto Canada',
            {
                reply_to_message_id: message.message_id,
            },
        );
    });
};

module.exports = addressHandler;
