const Sentry = require('@sentry/node');
const analytics = require('../utils/analytics');

const captureUser = (message) => {
    if (!message.from) {
        return;
    }

    const { from, location, text } = message;
    const userId = from.id.toString();

    analytics.identify({
        userId,
        traits: {
            first_name: from.first_name,
            last_name: from.last_name,
            username: from.username,
            language_code: from.language_code,
        },
    });

    Sentry.setUser(from);

    if (location) {
        analytics.track({
            userId,
            event: 'geo',
            properties: {
                latitude: location.latitude,
                longitude: location.longitude,
            },
        });
    }

    if (text) {
        let event = text;
        let properties = null;

        if (text === '/start') {
            event = 'start';
        }

        if (text === '/help') {
            event = 'help';
        }

        if (text.startsWith('/bug')) {
            event = 'bug';
        }

        if (text.startsWith('/address ')) {
            event = 'address';
            properties = {
                address: text.substring(text.indexOf(' ') + 1),
            };
        }

        analytics.track({
            userId,
            event,
            ...(properties && { properties }),
        });
    }

    analytics.flush();
};

const tracker = (bot) => {
    bot.on('message', captureUser);
};

module.exports = tracker;
