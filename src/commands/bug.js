const bugCommand = (bot) => {
    bot.onText(/^\/bug (.+)/, (message, [, withoutCommand]) => {
        console.log('Bug report command received');

        bot.sendMessage(
            process.env.CONTACT_CHAT_ID,
            `username: @${message.from.username}\nchat_id: ${message.chat.id}\nmessage_id: ${message.message_id}\nmessage: ${withoutCommand}`,
        );

        console.log(`Replying to user with bug response: ${withoutCommand}`);
        bot.sendMessage(message.chat.id, '✅ Your message was successfully sent', {
            reply_to_message_id: message.message_id,
        });

        console.log('Replied to user');
    });

    bot.onText(/^\/bug$/, (message) => {
        console.log('Empty bug report command received');
        bot.sendMessage(
            message.chat.id,
            '⚠️ You need to specify a message after the bug command to describe the problem you are encountering.\n\nFor example:\n/bug My Dhuhr time is incorrect',
            {
                reply_to_message_id: message.message_id,
            },
        );
    });
};

module.exports = bugCommand;
