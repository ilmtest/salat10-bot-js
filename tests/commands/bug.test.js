const TelegramBot = require('node-telegram-bot-api');
const hat = require('hat');
const { pause } = require('../../src/utils/testing');

const bug = require('../../src/commands/bug');

describe('bug', () => {
    let bot;
    let sendMessageSpy;

    beforeEach(() => {
        bot = new TelegramBot(hat());
        sendMessageSpy = jest.spyOn(bot, 'sendMessage');

        bug(bot);
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

    it('should reply to command if it has no extra arguments', async () => {
        const message = {
            message_id: hat(),
            text: '/bug',
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

    it('should send bug report', async () => {
        const complaint = hat();

        const message = {
            message_id: hat(),
            text: `/bug ${complaint}`,
            from: {
                username: hat(),
            },
            chat: {
                id: hat(),
            },
        };

        await bot.processUpdate({
            update_id: hat(),
            message,
        });

        await pause();

        expect(sendMessageSpy).toHaveBeenCalledTimes(2);
        expect(sendMessageSpy).toHaveBeenNthCalledWith(
            1,
            process.env.CONTACT_CHAT_ID,
            `username: @${message.from.username}\nchat_id: ${message.chat.id}\nmessage_id: ${message.message_id}\nmessage: ${complaint}`,
        );
    });
});
