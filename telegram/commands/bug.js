const analytics = require("../utils/analytics");

const onBug = async context => {
  console.log("Bug report command received");
  const { message_id, text } = context.message;
  const tokens = text.split(" ");
  const reply =
    tokens.length > 1
      ? "✅ Your message was successfully sent"
      : "⚠️ Write your message after /bug\n\nFor example:\n`/bug The app is not working for me`";

  if (tokens.length > 1) {
    const message = tokens.slice(1).join(" ");

    console.log("Bug report sent to author.");
    await context.telegram.sendMessage(
      process.env.CONTACT_CHAT_ID,
      `username: @${context.from.username}\nchat_id: ${context.chat.id}\nmessage_id: ${message_id}\nmessage: ${message}`
    );
  }

  console.log(`Replying to user with bug response: ${reply}`);
  await context.replyWithMarkdown(reply, {
    reply_to_message_id: message_id
  });

  console.log("Replied to user, sending analytics");

  analytics.track({
    userId: context.from.id.toString(),
    event: "bug",
    properties: {
      messageLength: text.length
    }
  });
};

const bugCommand = bot => bot.command("bug", onBug);

module.exports = bugCommand;
