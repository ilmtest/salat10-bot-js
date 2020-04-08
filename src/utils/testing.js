const isDevMode = process.env.ENV === 'dev';

const pause = async (delay = 1) => new Promise((resolve) => setTimeout(resolve, delay));

module.exports = {
    isDevMode,
    pause,
};
