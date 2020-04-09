const Analytics = require('analytics-node');
const { isDevMode } = require('./testing');

const analytics = new Analytics(process.env.SEGMENT_IO_WRITE_KEY, {
    enable: !isDevMode,
});

module.exports = analytics;
