const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const geocoder = require("../utils/geocoder");
const salatCalculator = require("../utils/salatCalculator");
const axios = require("axios");

const extractTime = data => data.toString();

/**
 * @desc Calculates prayer times for a specific address.
 * @route GET /api/v1/calculate
 * @access Public
 */
exports.calculateForAddress = asyncHandler(async (req, res, next) => {
  const { address } = req.query;

  if (!address) {
    return next(new ErrorResponse(`Address ${req.params.id} not found`, 403));
  }

  const [{ latitude, longitude }] = await geocoder.geocode(address);
  const {
    data: { timestamp }
  } = await axios.get(
    `${process.env.TIMEZONE_API_GATEWAY}/v2.1/get-time-zone?key=${process.env.TIMEZONE_API_KEY}&format=json&by=position&lat=${latitude}&lng=${longitude}`
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

  res.json({
    success: true,
    data: {
      fajr: extractTime(today.fajr),
      sunrise: extractTime(today.sunrise),
      dhuhr: extractTime(today.dhuhr),
      asr: extractTime(today.asr),
      maghrib: extractTime(today.maghrib),
      isha: extractTime(today.isha),
      halfNight: extractTime(halfNight),
      lastThirdNight: extractTime(lastThirdNight)
    }
  });
});
