const userMiddleware = bot => {
  ["start", "help", "bug"].forEach(command =>
    require(`./commands/${command}`)(bot)
  );

  ["location", "address", "bugReply"].forEach(handler =>
    require(`./handlers/${handler}`)(bot)
  );
};

module.exports = userMiddleware;
