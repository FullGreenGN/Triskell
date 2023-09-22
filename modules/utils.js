function logInfo(message) {
  console.log("[" + "INFO".brightBlue + "] " + message);
}

function logDebug(message) {
  console.log("[" + "DEBUG".magenta + "] " + message.white);
}

function logDebugMysql(message) {
  console.log("[" + "DEBUG".magenta + "] " + "[" + "MYSQL".yellow + "] " + message.white);
}

function logError(message) {
  console.log("[" + "ERROR".red + "] " + message.red);
}

const package = require("../package.json");
const request = require("request");

function checkUpdate() {
  request.get('http://www.whatever.com/my.csv', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var version = body;
      if (version != package.version) {
        logInfo("New version available: " + version);
      }
    }
  });
}

module.exports = { logInfo, logDebug, logDebugMysql, logError };
