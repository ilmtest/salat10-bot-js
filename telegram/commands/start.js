const analytics = require("../../utils/analytics");

const onStart = async context => {
  console.log("Replying to user with start response");
  await context.replyWithMarkdown(
    `\`${global.npm_package_name} v${global.npm_package_version}\` by @ilmtest

Send this bot an address, or attach your location to it and it will reply back with the prayer times for that location.

Submit bug reports with the /bug command.
See the help with the /help command.

Note: Please read the Help before filing any bugs of incorrect timings.
`,
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Telegram",
              url: "https://t.me/ilmtest"
            },
            {
              text: "Twitter",
              url: "https://twitter.com/ilmtest_"
            },
            {
              text: "Instagram",
              url: "https://instagram.com/ilmtest"
            }
          ],
          [
            {
              text: "Facebook",
              url: "https://facebook.com/ilmtest"
            },
            {
              text: "Tumblr",
              url: "https://ilmtest.tumblr.com"
            },
            {
              text: "Website",
              url: "https://www.ilmtest.net"
            }
          ]
        ]
      }
    }
  );

  analytics.track({
    userId: context.from.id.toString(),
    event: "start"
  });
};

const startCommand = bot => {
  console.log("*** registering...");
  bot.onText(/^\/start$/, msg => {
    console.log("*** msg", msg);
  });
};

module.exports = startCommand;
