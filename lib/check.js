require("dotenv").config();
const pwdnsalt = require("password-hash-and-salt");
const colors = require("colors");
const check = require("./check");
const dump = require("./dump");
const salt = require("./salt");
const checkDB = require("./checkDB");
const startServer = require("./startServer");
module.exports = (ui, DB, username, password) => {
  let data = DB.get("pwd");
  ui.startProgress("Finding User...");
  let user = data.filter(e => e["username"] === username);
  if (!user || user.length == 0) {
    ui.stopProgress();
    return 1;
  }
  ui.stopProgress();
  ui.writeInfoLine("User Found!");
  ui.startProgress("Verifying...");
  return pwdnsalt(password).verifyAgainst(user[0].hash, (err, verified) => {
    if (err) ui.writeError(err);
    if (!verified) {
      ui.stopProgress();
      ui.writeError("Wrong password!");
      return 2;
    } else {
      ui.stopProgress();
      ui.writeInfoLine(`Hi ${user[0].username}!`);
      ui.prompt(
        [
          {
            type: "list",
            name: "type",
            message: "Choose Type",
            choices: ["Salt", "Check", "Dump", "Check DB", "Start Server."]
          }
        ],
        ({ type }) => {
          if (type === "Check") {
            check(ui, DB, username, password);
          } else if (type === "Salt") {
            salt(ui, DB, username, password);
          } else if (type === "Dump") {
            dump(ui, DB, username, password);
          } else if (type === "Check DB") {
            checkDB(ui, DB, username, password);
          } else if (type === "Start Server.") {
            startServer(ui, DB);
          } else {
            ui.writeError("Invalid Type Entered.");
          }
        }
      );
    }
  });
};
