const isReplyDeleted = error =>
  error.code === 400 &&
  error.description === "Bad Request: reply message not found";

const handleBugReply = async (context, next) => {
  if (!context.state.private) {
    return next();
  }

  const { reply_to_message } = context.update.message;

  if (!reply_to_message) {
    return next();
  }

  const [chat_id, message_id] = reply_to_message.text.split("\n").slice(1, 3);
  const [chatId, messageId] = [chat_id, message_id].map(
    value => value.split(": ")[1]
  );

  if (chatId && messageId) {
    try {
      await context.telegram.sendMessage(chatId, context.message.text, {
        reply_to_message_id: messageId
      });
    } catch (error) {
      if (isReplyDeleted(error)) {
        console.warn(
          "Original message was deleted, not replying.",
          chatId,
          messageId
        );
        await context.telegram.sendMessage(chatId, context.message.text);
      }
    }
  } else {
    return next();
  }
};

const bugReply = bot => {
  bot.on("text", message => {
    console.log("*** message", message);
  });
};

module.exports = bugReply;
