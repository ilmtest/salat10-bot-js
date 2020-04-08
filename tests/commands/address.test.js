const TelegramBot = require('node-telegram-bot-api');
const hat = require('hat');
const sdk = require('@ilmtest/salat10-sdk');
const address = require('../../src/commands/address');
const { pause } = require('../../src/utils/testing');

jest.mock('@ilmtest/salat10-sdk');

describe('address', () => {
    let bot;
    let sendChatActionSpy;
    let sendMessageSpy;

    beforeEach(() => {
        bot = new TelegramBot(hat());

        sdk.calculate.mockRestore();
        sdk.formatAsText.mockRestore();
        sdk.reverseAddressLookup.mockRestore();

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

                sdk.reverseAddressLookup.mockResolvedValue(geo);

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
                expect(sdk.calculate).not.toHaveBeenCalled();
            });
        });
    });

    it('should send calculations', async () => {
        const latitude = hat();
        const longitude = hat();
        const city = hat();
        sdk.reverseAddressLookup.mockResolvedValue({ latitude, longitude, city });

        const calculationResult = hat();
        sdk.calculate.mockImplementation(() => calculationResult);

        const formattedText = hat();
        sdk.formatAsText.mockResolvedValue(formattedText);

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

        expect(sdk.reverseAddressLookup).toHaveBeenCalledTimes(1);
        expect(sdk.reverseAddressLookup).toHaveBeenCalledWith(location);

        expect(sdk.calculate).toHaveBeenCalledTimes(1);
        expect(sdk.calculate).toHaveBeenCalledWith(latitude, longitude);

        expect(sdk.formatAsText).toHaveBeenCalledTimes(1);
        expect(sdk.formatAsText).toHaveBeenCalledWith(calculationResult, latitude, longitude);

        expect(sendMessageSpy).toHaveBeenCalledTimes(1);
        expect(sendMessageSpy).toHaveBeenCalledWith(message.chat.id, formattedText, {
            chat_id: message.chat.id,
            reply_to_message_id: message.message_id,
            text: formattedText,
        });
    });
});
