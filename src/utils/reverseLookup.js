const geocoder = require('./geocoder');

/**
 * Looks up the geographical coordinates for the given textual address.
 * @param {*} address A textual address (ie: `Toronto, Canada`).
 * @returns A geographical coordinate in the shape of:
 * ```
 * { latitude: 45.1323, longitude: 23.122, city: 'Toronto', countryCode: 'CA' }
 * ```
 */
const reverseAddress = async (address) => {
    const result = await geocoder.geocode(address);
    const [{ latitude, longitude, city, countryCode }] = result;

    return { latitude, longitude, city, countryCode };
};

module.exports = reverseAddress;
