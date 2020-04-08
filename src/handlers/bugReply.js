const bugReply = (bot) => {
    bot.on('text', ({ reply_to_message: replyToMessage, chat, text }) => {
        if (chat.id.toString() !== process.env.CONTACT_CHAT_ID || !replyToMessage || !replyToMessage.text) {
            return;
        }

        const [chatIdValue, messageIdValue] = replyToMessage.text.split('\n').slice(1, 3);

        const [chatId, messageId] = [chatIdValue, messageIdValue]
            .filter((value) => value)
            .map((value) => value.split(': ')[1]);

        if (chatId && messageId) {
            console.log(`Sending reply to user: ${text}`);
            bot.sendMessage(chatId, text, {
                reply_to_message_id: messageId,
            });
        }
    });
};

module.exports = bugReply;
