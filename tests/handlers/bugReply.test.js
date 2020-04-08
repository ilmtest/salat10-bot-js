const TelegramBot = require('node-telegram-bot-api');
const hat = require('hat');
const { pause } = require('../../src/utils/testing');

const bugReply = require('../../src/handlers/bugReply');

describe('bugReply', () => {
    let bot;
    let sendMessageSpy;

    beforeEach(() => {
        bot = new TelegramBot(hat());
        sendMessageSpy = jest.spyOn(bot, 'sendMessage');

        bugReply(bot);
    });

    it('should not trigger on non-text messages', async () => {
        const message = {
            message_id: hat(),
            location: {
                latitude: hat(),
                longitude: hat(),
            },
            chat: {
                id: hat(),
            },
        };

        await bot.processUpdate({
            update_id: process.env.CONTACT_CHAT_ID,
            message,
        });

        await pause();

        expect(sendMessageSpy).not.toHaveBeenCalled();
    });

    it('should not process for non-admin chat', async () => {
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

    it('should not process if it is not a reply message', async () => {
        const message = {
            message_id: hat(),
            text: '/help',
            chat: {
                id: process.env.CONTACT_CHAT_ID,
            },
        };

        await bot.processUpdate({
            update_id: hat(),
            message,
        });

        await pause();

        expect(sendMessageSpy).not.toHaveBeenCalled();
    });

    it('should not process if reply message is not text', async () => {
        const message = {
            message_id: hat(),
            text: '/help',
            chat: {
                id: process.env.CONTACT_CHAT_ID,
            },
            reply_to_message: {
                location: {
                    latitude: hat(),
                    longitude: hat(),
                },
            },
        };

        await bot.processUpdate({
            update_id: hat(),
            message,
        });

        await pause();

        expect(sendMessageSpy).not.toHaveBeenCalled();
    });

    it('should not process if reply message is in invalid format', async () => {
        const message = {
            message_id: hat(),
            text: hat(),
            chat: {
                id: process.env.CONTACT_CHAT_ID,
            },
            reply_to_message: {
                text: hat(),
            },
        };

        await bot.processUpdate({
            update_id: hat(),
            message,
        });

        await pause();

        expect(sendMessageSpy).not.toHaveBeenCalled();
    });

    it('should send reply', async () => {
        const chatId = hat();
        const messageId = hat();

        const message = {
            message_id: hat(),
            text: hat(),
            chat: {
                id: process.env.CONTACT_CHAT_ID,
            },
            reply_to_message: {
                text: `username: ${hat()}\nchat_id: ${chatId}\nmessage_id: ${messageId}\nmessage: ${hat()}`,
            },
        };

        await bot.processUpdate({
            update_id: hat(),
            message,
        });

        await pause();

        expect(sendMessageSpy).toHaveBeenCalledTimes(1);
        expect(sendMessageSpy).toHaveBeenCalledWith(chatId, message.text, {
            chat_id: chatId,
            reply_to_message_id: messageId,
            text: message.text,
        });
    });
});
