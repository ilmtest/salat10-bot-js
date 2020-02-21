const axios = require("axios");
const SalatEvents = require("../utils/SalatEvents");

const getTimeZone = async (lat, lng, t) => {
  const {
    data: { zoneName, dst }
  } = await axios.get(`https://api.timezonedb.com/v2.1/get-time-zone`, {
    params: {
      key: process.env.TIMEZONE_API_KEY,
      format: "json",
      by: "position",
      lat,
      lng,
      time: t.toString()
    }
  });

  return { zoneName, dst };
};

const formatTime = (t, timeZone, dst) => {
  const offset = parseInt(dst, 10);
  const date = new Date(t);
  date.setUTCHours(date.getUTCHours() + offset);

  const time = date.toLocaleTimeString("en-US", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });
  return time;
};

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
  const { timeZone, dst } = await getTimeZone(
    latitude,
    longitude,
    calculationResult.fajr
  );

  const formatted = Object.entries(calculationResult)
    // sort the events from earliest to latest (to sort from fajr - isha)
    .sort(([_, value], [__, nextValue]) => value - nextValue)
    // transform from keys to actual event names
    .map(([event, t]) => {
      return `${SalatEvents[event]}: ${formatTime(t, timeZone, dst)}`;
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
  const { timeZone, dst } = await getTimeZone(
    latitude,
    longitude,
    calculationResult.fajr
  );

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
              time: formatTime(t, timeZone, dst)
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
