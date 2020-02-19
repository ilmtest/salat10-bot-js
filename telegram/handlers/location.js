const calculator = require("../../utils/calculator");
const analytics = require("../../utils/analytics");
const { formatAsText } = require("../../utils/eventFormatter");

const locationHandler = bot => {
  bot.on("location", async ({ location, chat, message_id, from }) => {
    const { latitude, longitude } = location;
    console.log(`Received new coordinates: (${latitude}, ${longitude})`);
    const result = calculator(latitude, longitude);
    const data = await formatAsText(result, latitude, longitude);
    bot.sendMessage(chat.id, data, {
      reply_to_message_id: message_id
    });

    analytics.track({
      userId: from.id.toString(),
      event: "geo",
      properties: {
        latitude,
        longitude
      }
    });
  });
};

module.exports = locationHandler;
