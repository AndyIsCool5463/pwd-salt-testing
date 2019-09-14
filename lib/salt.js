require("dotenv").config();
const pwdnsalt = require("password-hash-and-salt");
const colors = require("colors");
const { spawn, Thread, Worker } = require("threads");

module.exports = (ui, DB, username, password) => {
  ui.startProgress("Salting");
  if (
    DB.get("pwd").filter(vendor => vendor["username"] === username).length > 0
  ) {
    ui.stopProgress();
    return ui.writeError("User already been created!");
  }
  pwdnsalt(password).hash(async (err, hash) => {
    if (err) return ui.writeError(err);
    ui.stopProgress();
    ui.writeInfoLine(`Hash is: ${hash}`);
    ui.startProgress(`Storing User: ${username} in DB.`);
    DB.push("pwd", {
      //  I need to change this to another thread, its blocking main thread from working...
      username: username, //
      hash: hash //
    });
    setTimeout(() => kys(ui, DB, username, hash, password), 1500);
  });
};
function kys(ui, DB, username, hash, password) {
  ui.stopProgress();
  ui.startProgress("Ensuring Hash was saved correctly.");

  let user = DB.get("pwd").filter(vendor => vendor["username"] === username);
  pwdnsalt(password).verifyAgainst(user[0].hash, function(error, verified) {
    if (error) {
      ui.stopProgress();
      throw new Error("Something went wrong! \n\n\n" + error);
    }
    if (!verified) {
      ui.stopProgress();
      console.log(
        `- ${user} \n\n - ${password} \n\n -${hash} \n\n - ${user[0].hash}`
      );
      console.log("Don't try! We got you!");
    } else {
      ui.stopProgress();
      return console.log(colors.green("Verified!"));
    }
  });
}
