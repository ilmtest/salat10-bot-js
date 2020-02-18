const calculator = require("../utils/calculator");
const axios = require("axios");
const SalatEvents = require("../utils/SalatEvents");
const analytics = require("../utils/analytics");

const processCoordinates = async context => {
  const { latitude, longitude } = context.message.location;
  console.log(`Received new coordinates: (${latitude}, ${longitude})`);
  const result = calculator(latitude, longitude);

  const {
    data: { zoneName: timeZone }
  } = await axios.get(
    `https://api.timezonedb.com/v2.1/get-time-zone?key=${process.env.TIMEZONE_API_KEY}&format=json&by=position&lat=${latitude}&lng=${longitude}`
  );

  const formatted = Object.entries(result)
    // sort the events from earliest to latest (to sort from fajr - isha)
    .sort(([_, value], [__, nextValue]) => value - nextValue)
    // transform from keys to actual event names
    .map(([event, t]) => {
      const date = new Date(t)
        .toLocaleString("en-US", { timeZone })
        .split(", ")[1];
      return `${SalatEvents[event]}: ${date}`;
    });
  formatted.unshift(
    new Date(result.fajr).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric"
    }),
    ""
  );

  console.log(`Replying to user with: ${formatted}`);
  await context.reply(formatted.join("\n"), {
    reply_to_message_id: context.message.message_id
  });
};

const processGeoCoordinates = async context => {
  analytics.track({
    userId: context.from.id.toString(),
    event: "geo",
    properties: {
      ...context.message.location
    }
  });

  return await processCoordinates(context);
};

const locationHandler = bot => bot.on("location", processGeoCoordinates);

module.exports = { locationHandler, processCoordinates };
