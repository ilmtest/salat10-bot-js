const TelegramBot = require('node-telegram-bot-api');
const hat = require('hat');
const { pause } = require('../../src/utils/testing');

const help = require('../../src/commands/help');

describe('help', () => {
    let bot;
    let sendMessageSpy;

    beforeEach(() => {
        bot = new TelegramBot(hat());
        sendMessageSpy = jest.spyOn(bot, 'sendMessage');

        help(bot);
    });

    it('should not reply to foreign commands', async () => {
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

        expect(sendMessageSpy).not.toHaveBeenCalled();
    });

    it('should not reply to command with extra arguments', async () => {
        const message = {
            message_id: hat(),
            text: '/help 1234',
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

    it('should reply to help command', async () => {
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

        expect(sendMessageSpy).toHaveBeenCalledTimes(1);
    });
});
