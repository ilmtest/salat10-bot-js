const helpCommand = (bot) => {
    bot.onText(/^\/help$/, (message) => {
        console.log('Replying to user with help command');
        bot.sendMessage(
            message.chat.id,
            `Note that Salat10 uses the nautical twilight to calculate the Fajr and ʿIshāʾ timings instead of the conventional varying angles that are used by the various organizations around the world.

The other angles employed by the various other organizations do not produce the right results of the correct entrance of Fajr that is visible when one observes it with the sight.
https://ilmtest.tumblr.com/post/172226611121/fajr

Also it is important to always know that the origin of the matter is to observe the timings of the prayers using the eyesight just as it was done at the time of the Messenger ﷺ. As a result, prayer time apps such as this should only be used as a supporting guide and not as the primary dependency.

Tutorial on how to use the bot:
https://s5.gifyu.com/images/tutorial.gif`,
            {
                reply_to_message_id: message.message_id,
            },
        );
    });
};

module.exports = helpCommand;
