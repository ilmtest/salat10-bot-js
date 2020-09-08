const TelegramBot = require('node-telegram-bot-api');
const hat = require('hat');
const calculate = require('../../src/utils/calculator');
const reverseLookup = require('../../src/utils/reverseLookup');
const address = require('../../src/commands/address');
const SalatNames = require('../../src/utils/SalatNames');
const { pause } = require('../../src/utils/testing');

jest.mock('../../src/utils/calculator');
jest.mock('../../src/utils/reverseLookup');

describe('address', () => {
    let bot;
    let sendChatActionSpy;
    let sendMessageSpy;

    beforeEach(() => {
        bot = new TelegramBot(hat());

        calculate.mockRestore();
        reverseLookup.mockRestore();

        sendChatActionSpy = jest.spyOn(bot, 'sendChatAction');
        sendMessageSpy = jest.spyOn(bot, 'sendMessage');
    });

    it('should not reply to foreign commands', async () => {
        address(bot);

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

    it('should reply to a address command without arguments', async () => {
        address(bot);

        const message = {
            message_id: hat(),
            text: `/address`,
            chat: {
                id: hat(),
            },
        };

        await bot.processUpdate({
            update_id: hat(),
            message,
        });

        expect(sendMessageSpy).toHaveBeenCalledTimes(1);
    });

    describe('location not found', () => {
        [{ latitude: hat() }, { longitude: hat() }, { city: hat() }].forEach((geo) => {
            it('should not calculate unless latitude, longitude and city are all found', async () => {
                address(bot);

                reverseLookup.mockResolvedValue(geo);

                const message = {
                    message_id: hat(),
                    text: `/address ${hat()}`,
                    chat: {
                        id: hat(),
                    },
                };

                await bot.processUpdate({
                    update_id: hat(),
                    message,
                });

                await pause();

                expect(sendChatActionSpy).toHaveBeenCalledTimes(1);
                expect(sendChatActionSpy).toHaveBeenCalledWith(message.chat.id, 'typing');

                expect(sendMessageSpy).toHaveBeenCalledTimes(1);
                expect(calculate).not.toHaveBeenCalled();
            });
        });
    });

    it('should send calculations', async () => {
        const data = {
            latitude: hat(),
            longitude: hat(),
            city: hat(),
            countryCode: hat(),
        };

        reverseLookup.mockResolvedValue(data);

        const formattedText = hat();
        calculate.mockResolvedValue(formattedText);

        address(bot);

        const location = hat();

        const message = {
            message_id: hat(),
            text: `/address ${location}`,
            chat: {
                id: hat(),
            },
        };

        await bot.processUpdate({
            update_id: hat(),
            message,
        });

        await pause();

        expect(sendChatActionSpy).toHaveBeenCalledTimes(1);
        expect(sendChatActionSpy).toHaveBeenCalledWith(message.chat.id, 'typing');

        expect(reverseLookup).toHaveBeenCalledTimes(1);
        expect(reverseLookup).toHaveBeenCalledWith(location);

        expect(calculate).toHaveBeenCalledTimes(1);
        expect(calculate).toHaveBeenCalledWith(SalatNames, data.latitude, data.longitude);

        const text = `${data.city}, ${data.countryCode}\n\n${formattedText}`;

        expect(sendMessageSpy).toHaveBeenCalledTimes(1);
        expect(sendMessageSpy).toHaveBeenCalledWith(message.chat.id, text, {
            chat_id: message.chat.id,
            reply_to_message_id: message.message_id,
            text,
        });
    });
});
