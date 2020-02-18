const analytics = require("../../utils/analytics");

const bugCommand = bot => {
  bot.onText(/^\/bug (.+)/, (message, [withCommand, withoutCommand]) => {
    console.log("Bug report command received");

    bot.sendMessage(
      process.env.CONTACT_CHAT_ID,
      `username: @${message.from.username}\nchat_id: ${message.chat.id}\nmessage_id: ${message.message_id}\nmessage: ${withoutCommand}`
    );

    console.log(`Replying to user with bug response: ${reply}`);
    bot.sendMessage(message.chat.id, "✅ Your message was successfully sent", {
      reply_to_message_id: message.message_id
    });

    console.log("Replied to user, sending analytics");

    analytics.track({
      userId: message.from.id.toString(),
      event: "bug",
      properties: {
        messageLength: withoutCommand.length
      }
    });
  });
};

module.exports = bugCommand;
