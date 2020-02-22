const bugReply = bot => {
  bot.on("text", ({ reply_to_message, chat, text, message_id: replyId }) => {
    if (chat.id.toString() !== process.env.CONTACT_CHAT_ID) {
      return;
    }

    const [chat_id, message_id] = reply_to_message.text.split("\n").slice(1, 3);
    const [chatId, messageId] = [chat_id, message_id].map(
      value => value.split(": ")[1]
    );

    if (chatId && messageId) {
      console.log(`Sending reply to user: ${text}`);
      bot.sendMessage(chatId, text, {
        reply_to_message_id: messageId
      });
    } else {
      bot.sendMessage(chat.id, "Invalid message format", {
        reply_to_message_id: replyId
      });
    }
  });
};

module.exports = bugReply;
