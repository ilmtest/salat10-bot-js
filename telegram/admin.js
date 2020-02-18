const adminMiddleware = bot => {
  require("./handlers/bugReply")(bot);
};

module.exports = adminMiddleware;
