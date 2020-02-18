const analytics = require("../../utils/analytics");
const geocoder = require("../../utils/geocoder");
const calculator = require("../../utils/calculator");
const { formatAsText } = require("../../utils/eventFormatter");

const addressHandler = bot => {
  console.log("*** handle address");
  bot.on("text", async message => {
    const { text } = message;
    console.log(`Received new address: (${text})`);

    const { latitude, longitude, city } = await geocoder(text);
    console.log(`Geocoded address: (${latitude}, ${longitude}, ${city})`);

    analytics.track({
      userId: message.from.id.toString(),
      event: "address",
      properties: {
        address: text
      }
    });

    if (latitude && longitude && city) {
      console.log("Processing coordinates for reversed address");
      const result = calculator(latitude, longitude);
      const data = await formatAsText(result, latitude, longitude);
      bot.sendMessage(message.chat.id, data, {
        reply_to_message_id: message.message_id
      });
    } else {
      console.log("No address found");
      bot.sendMessage(
        message.chat.id,
        "⚠️ No address found with that query. Please try something more accurate.",
        {
          reply_to_message_id: message.message_id
        }
      );
    }
  });
};

module.exports = addressHandler;
