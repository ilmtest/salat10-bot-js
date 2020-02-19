const analytics = require("../../utils/analytics");

const isReplyDeleted = error =>
  error.code === 400 &&
  error.description === "Bad Request: reply message not found";

const bugReply = bot => {
  bot.on(
    "text",
    async ({ reply_to_message, chat, text, date, message_id: replyId }) => {
      if (chat.id !== process.env.CONTACT_CHAT_ID) {
        return;
      }

      const [chat_id, message_id] = reply_to_message.text
        .split("\n")
        .slice(1, 3);
      const [chatId, messageId] = [chat_id, message_id].map(
        value => value.split(": ")[1]
      );

      if (chatId && messageId) {
        try {
          await bot.sendMessage(chatId, text, {
            reply_to_message_id: messageId
          });
        } catch (error) {
          if (isReplyDeleted(error)) {
            console.warn(
              "Original message was deleted, not replying.",
              chatId,
              messageId
            );
            bot.sendMessage(chatId, text);

            const now = Math.floor(Date.now() / 1000);

            analytics.track({
              userId: chatId,
              event: "deleted_bug_report",
              properties: {
                diff: (now - date).toString()
              }
            });
          }
        }
      } else {
        bot.sendMessage(chat.id, "Invalid message format", {
          reply_to_message_id: replyId
        });
      }
    }
  );
};

module.exports = bugReply;
