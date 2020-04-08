jest.mock('analytics-node');
jest.mock('@sentry/node');
jest.mock('../../src/utils/analytics');

const TelegramBot = require('node-telegram-bot-api');
const hat = require('hat');
const Sentry = require('@sentry/node');

const analytics = require('../../src/utils/analytics');
const tracker = require('../../src/middlewares/tracker');

describe('tracker', () => {
    let bot;
    let message;

    beforeEach(() => {
        analytics.identify.mockRestore();
        analytics.track.mockRestore();
        analytics.flush.mockRestore();
        Sentry.setUser.mockRestore();

        bot = new TelegramBot(hat());

        message = {
            message_id: hat(),
            chat: {
                id: hat(),
            },
            from: {
                id: hat(),
                first_name: hat(),
                last_name: hat(),
                username: hat(),
                language_code: hat(),
            },
        };

        tracker(bot);
    });

    it('messages without a from attribute should not be tracked', async () => {
        message.text = hat();
        delete message.from;

        await bot.processUpdate({
            update_id: hat(),
            message,
        });

        expect(analytics.identify).not.toHaveBeenCalled();
    });

    it('should not track non-text/location messages', async () => {
        await bot.processUpdate({
            update_id: hat(),
            message,
        });

        expect(analytics.identify).toHaveBeenCalledTimes(1);
        expect(analytics.identify).toHaveBeenCalledWith({
            userId: message.from.id,
            traits: {
                first_name: message.from.first_name,
                last_name: message.from.last_name,
                username: message.from.username,
                language_code: message.from.language_code,
            },
        });

        expect(Sentry.setUser).toHaveBeenCalledTimes(1);
        expect(Sentry.setUser).toHaveBeenCalledWith(message.from);

        expect(analytics.track).not.toHaveBeenCalled();
        expect(analytics.flush).toHaveBeenCalledTimes(1);
    });

    it('should track text messages', async () => {
        message.text = hat();

        await bot.processUpdate({
            update_id: hat(),
            message,
        });

        expect(analytics.identify).toHaveBeenCalledTimes(1);
        expect(analytics.track).toHaveBeenCalledTimes(1);
        expect(analytics.track).toHaveBeenCalledWith({
            userId: message.from.id,
            event: message.text,
        });
        expect(analytics.flush).toHaveBeenCalledTimes(1);
    });

    it('should track start command', async () => {
        message.text = '/start';

        await bot.processUpdate({
            update_id: hat(),
            message,
        });

        expect(analytics.track).toHaveBeenCalledWith({
            userId: message.from.id,
            event: 'start',
        });
    });

    it('should track help command', async () => {
        message.text = '/help';

        await bot.processUpdate({
            update_id: hat(),
            message,
        });

        expect(analytics.track).toHaveBeenCalledWith({
            userId: message.from.id,
            event: 'help',
        });
    });

    it('should track bug command', async () => {
        message.text = '/bug';

        await bot.processUpdate({
            update_id: hat(),
            message,
        });

        expect(analytics.track).toHaveBeenCalledWith({
            userId: message.from.id,
            event: 'bug',
        });
    });

    it('should track start command', async () => {
        const address = hat();
        message.text = `/address ${address}`;

        await bot.processUpdate({
            update_id: hat(),
            message,
        });

        expect(analytics.track).toHaveBeenCalledWith({
            userId: message.from.id,
            event: 'address',
            properties: {
                address,
            },
        });
    });

    it('should track location messages', async () => {
        message.location = {
            latitude: hat(),
            longitude: hat(),
        };

        await bot.processUpdate({
            update_id: hat(),
            message,
        });

        expect(analytics.identify).toHaveBeenCalledTimes(1);
        expect(analytics.track).toHaveBeenCalledTimes(1);
        expect(analytics.track).toHaveBeenCalledWith({
            userId: message.from.id,
            event: 'geo',
            properties: {
                ...message.location,
            },
        });
        expect(analytics.flush).toHaveBeenCalledTimes(1);
    });
});
