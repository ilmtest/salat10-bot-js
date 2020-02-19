const userMiddleware = bot => {
  ["address", "start", "help", "bug"].forEach(command =>
    require(`./commands/${command}`)(bot)
  );

  ["location", "bugReply"].forEach(handler =>
    require(`./handlers/${handler}`)(bot)
  );
};

module.exports = userMiddleware;
