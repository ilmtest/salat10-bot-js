const NodeGeocoder = require("node-geocoder");
const options = {
  provider: process.env.GEOCODER_PROVIDER,
  httpAdapter: "https",
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};

const geocoder = NodeGeocoder(options);

const reverseAddress = async address => {
  const result = await geocoder.geocode(address);
  const [{ latitude, longitude, city }] = result;

  return { latitude, longitude, city };
};

module.exports = reverseAddress;
