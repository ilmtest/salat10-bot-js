const { CalculationParameters, PrayerTimes, SunnahTimes, Coordinates } = require('adhan');
const getTimeZone = require('./getTimeZone');

const formatTime = (t, timeZone) => {
    const time = new Date(t).toLocaleTimeString('en-US', {
        timeZone,
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
    return time;
};

const formatDate = (fajr) => {
    return new Date(fajr).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
};

/**
 * Returns a list of formatted times ordered from earliest to latest.
 * @param {*} calculationResult The result of the calculation times (object).
 * @param {*} latitude
 * @param {*} longitude
 */
const formatAsText = (calculationResult, timeZone, salatLabels) => {
    const formatted = Object.entries(calculationResult)
        // sort the events from earliest to latest (to sort from fajr - isha)
        .sort(([, value], [, nextValue]) => value - nextValue)
        // transform from keys to actual event names
        .map(([event, t]) => {
            return `${salatLabels[event]}: ${formatTime(t, timeZone)}`;
        });
    formatted.unshift(formatDate(calculationResult.fajr), '');

    return formatted.join('\n');
};

const daily = async (salatLabels, latitude, longitude, now = new Date()) => {
    const fard = new PrayerTimes(
        new Coordinates(Number(latitude), Number(longitude)),
        now,
        new CalculationParameters('NauticalTwilight', 12, 12),
    );

    const sunan = new SunnahTimes(fard);
    const { coordinates, calculationParameters, date, ...rest } = { ...fard, ...sunan };
    const { timeZone } = await getTimeZone(latitude, longitude, rest.fajr.getTime());

    return formatAsText(rest, timeZone, salatLabels);
};

module.exports = daily;
