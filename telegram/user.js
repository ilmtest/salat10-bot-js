const userMiddleware = bot => {
  ["start", "help", "bug"].forEach(command =>
    require(`./commands/${command}`)(bot)
  );

  const { locationHandler } = require("./handlers/location");
  locationHandler(bot);

  require("./handlers/address")(bot);
};

module.exports = userMiddleware;
