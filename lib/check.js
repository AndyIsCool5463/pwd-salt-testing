require("dotenv").config();
const pwdnsalt = require("password-hash-and-salt");
module.exports = (ui, DB, username, password) => {
  let data = DB.get("pwd");
  ui.startProgress("Finding User...");
  let user = data.filter(e => e["username"] === username);
  if (!user || user.length == 0) {
    return ui.writeError("No User found!");
  }
  ui.stopProgress();
  ui.showInfoLine("User Found!");
  ui.startProgress("Verifying...");
  pwdnsalt(password).verifyAgainst(user[0].hash, (err, verified) => {
    if (err) ui.writeError(err);
    if (!verified) {
      ui.writeError("Wrong password!");
    } else {
      console.log(`Hi ${user.username}!`);
    }
  });
};
