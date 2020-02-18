const axios = require("axios");
const SalatEvents = require("../utils/SalatEvents");

const getTimeZone = async (latitude, longitude) => {
  const {
    data: { zoneName }
  } = await axios.get(
    `https://api.timezonedb.com/v2.1/get-time-zone?key=${process.env.TIMEZONE_API_KEY}&format=json&by=position&lat=${latitude}&lng=${longitude}`
  );

  return zoneName;
};

const formatTime = (t, timeZone) =>
  new Date(t).toLocaleString("en-US", { timeZone }).split(", ")[1];

const formatDate = result =>
  new Date(result.fajr).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });

/**
 * Returns a list of formatted times ordered from earliest to latest.
 * @param {*} calculationResult The result of the calculation times (object).
 * @param {*} latitude
 * @param {*} longitude
 */
const formatAsText = async (calculationResult, latitude, longitude) => {
  const timeZone = await getTimeZone(latitude, longitude);

  const formatted = Object.entries(calculationResult)
    // sort the events from earliest to latest (to sort from fajr - isha)
    .sort(([_, value], [__, nextValue]) => value - nextValue)
    // transform from keys to actual event names
    .map(([event, t]) => {
      return `${SalatEvents[event]}: ${formatTime(t, timeZone)}`;
    });
  formatted.unshift(formatDate(calculationResult), "");

  return formatted.join("\n");
};

/**
 * Returns a list of formatted times ordered from earliest to latest.
 * @param {*} calculationResult The result of the calculation times (object).
 * @param {*} latitude
 * @param {*} longitude
 */
const formatAsObject = async (calculationResult, latitude, longitude) => {
  const timeZone = await getTimeZone(latitude, longitude);

  return (
    Object.entries(calculationResult)
      // sort the events from earliest to latest (to sort from fajr - isha)
      .sort(([_, value], [__, nextValue]) => value - nextValue)
      .reduce(
        (prev, [event, t]) => {
          return {
            ...prev,
            [event]: {
              label: SalatEvents[event],
              time: formatTime(t, timeZone)
            }
          };
        },
        { date: formatDate(calculationResult) }
      )
  );
};

module.exports = {
  formatAsText,
  formatAsObject
};
