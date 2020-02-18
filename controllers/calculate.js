const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const geocoder = require("../utils/geocoder");
const calculator = require("../utils/calculator");
const { formatAsObject } = require("../utils/eventFormatter");

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

  const { latitude: lat, longitude: lon, city } = await geocoder(address);

  if (lat && lon && city) {
    return { latitude: lat, longitude: lon };
  }

  return next(new ErrorResponse(`Address not found: ${address}`, 404));
};

/**
 * @desc Calculates prayer times for a specific address.
 * @route GET /api/v1/calculate
 * @access Public
 */
exports.calculateForAddress = asyncHandler(async (req, res, next) => {
  const { latitude, longitude } = await getCoordinates(req, next);
  const result = calculator(latitude, longitude);
  const data = await formatAsObject(result, latitude, longitude);

  res.json({
    success: true,
    data
  });
});
