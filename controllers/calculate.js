const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const geocoder = require("../utils/geocoder");
const salatCalculator = require("../utils/salatCalculator");
const axios = require("axios");

const extractTime = data => data.getTime();

const calculateForCoordinates = async (latitude, longitude) => {
  const {
    data: { timestamp, zoneName, gmtOffset, dst }
  } = await axios.get(
    `https://api.timezonedb.com/v2.1/get-time-zone?key=${process.env.TIMEZONE_API_KEY}&format=json&by=position&lat=${latitude}&lng=${longitude}`
  );

  const now = new Date(timestamp * 1000);
  const today = salatCalculator.calculate(
    now,
    Number(latitude),
    Number(longitude)
  );
  // not sure why we have to put 48 instead of 24
  const tomorrow = salatCalculator.calculate(
    new Date(now.getTime() + 48 * 3600 * 1000),
    Number(latitude),
    Number(longitude)
  );

  const halfNight = new Date(
    (today.maghrib.getTime() + tomorrow.fajr.getTime()) / 2
  );

  const diff = tomorrow.fajr.getTime() - today.maghrib.getTime();
  const lastThirdNight = new Date(tomorrow.fajr.getTime() - diff / 3);

  return {
    zoneName,
    gmtOffset,
    dst,
    fajr: extractTime(today.fajr),
    sunrise: extractTime(today.sunrise),
    dhuhr: extractTime(today.dhuhr),
    asr: extractTime(today.asr),
    maghrib: extractTime(today.maghrib),
    isha: extractTime(today.isha),
    halfNight: extractTime(halfNight),
    lastThirdNight: extractTime(lastThirdNight)
  };
};

const getCoordinates = async (req, next) => {
  const { address, latitude, longitude } = req.query;

  if (!address && !latitude && !longitude) {
    return next(
      new ErrorResponse(`Address & coordinates ${req.params.id} not found`, 403)
    );
  }

  if (latitude && longitude) {
    return Promise.resolve({ latitude, longitude });
  }

  const [result] = await geocoder.geocode(address);
  return { latitude: result.latitude, longitude: result.longitude };
};

/**
 * @desc Calculates prayer times for a specific address.
 * @route GET /api/v1/calculate
 * @access Public
 */
exports.calculateForAddress = asyncHandler(async (req, res, next) => {
  const { latitude, longitude } = await getCoordinates(req, next);
  const data = await calculateForCoordinates(latitude, longitude);

  res.json({
    success: true,
    data
  });
});
