const analytics = require("../../utils/analytics");
const geocoder = require("../../utils/geocoder");
const calculator = require("../../utils/calculator");
const { formatAsText } = require("../../utils/eventFormatter");

const addressHandler = bot => {
  bot.onText(/^\/address (.+)/, async (message, [_, text]) => {
    const {
      chat: { id: chatId },
      from,
      message_id
    } = message;
    bot.sendChatAction(chatId, "typing");
    console.log(`Received new address: (${text})`);

    const { latitude, longitude, city } = await geocoder(text);
    console.log(`Geocoded address: (${latitude}, ${longitude}, ${city})`);

    analytics.track({
      userId: from.id.toString(),
      event: "address",
      properties: {
        address: text
      }
    });

    if (latitude && longitude && city) {
      console.log("Processing coordinates for reversed address");
      const result = calculator(latitude, longitude);
      const data = await formatAsText(result, latitude, longitude);
      bot.sendMessage(chatId, data, {
        reply_to_message_id: message_id
      });
    } else {
      console.log("No address found");
      bot.sendMessage(
        chatId,
        "⚠️ No address found with that query. Please try something more accurate.",
        {
          reply_to_message_id: message_id
        }
      );
    }
  });
};

module.exports = addressHandler;
