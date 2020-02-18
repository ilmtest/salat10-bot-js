const analytics = require("../utils/analytics");

const onTrigger = (context, next) => {
  const { id, first_name, last_name, username, language_code } = context.from;

  if (context.updateSubTypes[0] === "text") {
    console.log(
      `${JSON.stringify(context.from)} said: ${context.message.text}`
    );
  } else {
    console.log(
      `${JSON.stringify(context.from)} sent: ${context.updateSubTypes[0]}`
    );
  }

  if (context.chat.id.toString() === process.env.CONTACT_CHAT_ID.toString()) {
    context.state.private = true;
  } else {
    analytics.identify({
      userId: id.toString(),
      traits: {
        first_name,
        last_name,
        username,
        language_code
      }
    });

    analytics.track({
      userId: id.toString(),
      event: context.updateSubTypes[0]
    });
  }

  next(context); // if we didn't modify the context object, we can just call next() without passing in the context
};

const universal = bot => bot.use(onTrigger);
module.exports = universal;
