const Analytics = require("analytics-node");
const devAnalytics = {
  track: () => {}
};

const analytics =
  process.env.NODE_ENV !== "production"
    ? devAnalytics
    : new Analytics(process.env.SEGMENT_IO_WRITE_KEY);
module.exports = analytics;
