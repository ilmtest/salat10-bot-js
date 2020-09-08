const axios = require('axios');

/**
 * Looks up the timezone for the given geographical coordinates.
 * @param {*} lat The latitude.
 * @param {*} lng The longitude.
 * @param {*} t The epoch timestamp for the date.
 * @returns A timezone in the shape of:
 * ```
 * { timeZone: 'America/Toronto' }
 * ```
 */
const getTimeZone = async (lat, lng, t) => {
    const {
        data: { zoneName },
    } = await axios.get(`https://api.timezonedb.com/v2.1/get-time-zone`, {
        params: {
            key: process.env.TIMEZONE_API_KEY,
            format: 'json',
            by: 'position',
            lat,
            lng,
            time: t.toString(),
        },
    });

    console.log('Timezone detected:', zoneName);

    return { timeZone: zoneName };
};

module.exports = getTimeZone;
