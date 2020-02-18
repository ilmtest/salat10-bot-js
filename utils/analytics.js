const Analytics = require("analytics-node");
const analytics = new Analytics(process.env.SEGMENT_IO_WRITE_KEY);

module.exports = analytics;
