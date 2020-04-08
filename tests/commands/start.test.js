const TelegramBot = require('node-telegram-bot-api');
const hat = require('hat');
const { pause } = require('../../src/utils/testing');

const start = require('../../src/commands/start');

describe('start', () => {
    let bot;
    let sendMessageSpy;

    beforeEach(() => {
        bot = new TelegramBot(hat());
        sendMessageSpy = jest.spyOn(bot, 'sendMessage');
        start(bot);
    });

    it('should not reply to foreign commands', async () => {
        const message = {
            message_id: hat(),
            text: '/help',
            chat: {
                id: hat(),
            },
        };

        await bot.processUpdate({
            update_id: hat(),
            message,
        });

        await pause();

        expect(sendMessageSpy).not.toHaveBeenCalled();
    });

    it('should not reply to command if it has extra arguments', async () => {
        const message = {
            message_id: hat(),
            text: '/start 1234',
            chat: {
                id: hat(),
            },
        };

        await bot.processUpdate({
            update_id: hat(),
            message,
        });

        await pause();

        expect(sendMessageSpy).not.toHaveBeenCalled();
    });

    it('should reply to start command', async () => {
        const message = {
            message_id: hat(),
            text: '/start',
            chat: {
                id: hat(),
            },
        };

        await bot.processUpdate({
            update_id: hat(),
            message,
        });

        await pause();

        expect(sendMessageSpy).toHaveBeenCalledTimes(1);
    });
});
