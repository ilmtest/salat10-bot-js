const TelegramBot = require("node-telegram-bot-api");
const hat = require("hat");
const axios = require("axios");
const geocoder = require("../../utils/geocoder");
jest.mock("../../utils/geocoder"); // geocoder is now a mock constructor

describe("address", () => {
  beforeEach(() => {
    axios.get.mockRestore();

    axios.get.mockResolvedValue({
      data: {
        zoneName: "America/Toronto",
        dst: "0"
      }
    });

    geocoder.mockClear();
    geocoder.mockResolvedValue({
      latitude: 233,
      longitude: 1324,
      city: "Ottawa"
    });
  });

  it("should handle an address command", async () => {
    const bot = new TelegramBot(hat());
    const sendChatActionSpy = jest.spyOn(bot, "sendChatAction");

    require("./address")(bot);

    const addressText = hat();

    const message = {
      message_id: 1,
      text: `/address ${addressText}`,
      chat: {
        id: 2
      },
      from: {
        id: 3
      }
    };

    await bot.processUpdate({
      update_id: 4,
      message
    });

    expect(sendChatActionSpy).toHaveBeenCalledTimes(1);
    expect(sendChatActionSpy).toHaveBeenCalledWith(message.chat.id, "typing");
  });
});
