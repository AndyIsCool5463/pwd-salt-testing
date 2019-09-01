require("dotenv").config();
const pwdnsalt = require("password-hash-and-salt");
const colors = require("colors");
module.exports = (ui, DB, username, password) => {
  ui.startProgress("Salting");
  if (
    DB.get("pwd").filter(vendor => vendor["username"] === username).length > 0
  ) {
    ui.stopProgress();
    return ui.writeError("User already been created!");
  }
  pwdnsalt(password).hash((err, hash) => {
    if (err) return ui.writeError(err);
    ui.stopProgress();
    ui.writeInfoLine(`Hash is: ${hash}`);
    ui.startProgress(`Storing User: ${username} in DB.`);
    DB.push("pwd", {
      username: username,
      hash: hash
    });
    ui.stopProgress();
    ui.startProgress("Ensuring Hash was saved correctly.");
    let abd = DB.get("pwd");
    let user = abd.filter(vendor => vendor["username"] === username);
    pwdnsalt(password).verifyAgainst(user[0].hash, function(error, verified) {
      if (error) {
        ui.stopProgress();
        throw new Error("Something went wrong! \n\n\n" + error);
      }
      if (!verified) {
        ui.stopProgress();
        console.log("Don't try! We got you!");
      } else {
        ui.stopProgress();
        return console.log(colors.green("Verified!"));
      }
    });
  });
};
