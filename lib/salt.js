require("dotenv").config();
const pwdnsalt = require("password-hash-and-salt");
module.exports = (ui, DB, username, password) => {
  pwdnsalt(password).hash(process.env.SALT, (err, hash) => {
    if (err) return console.log(colors.red(`ERROR: \n \n ${err}`));
    if (
      DB.get("pwd").filter(vendor => vendor["username"] === username).length > 0
    )
      return console.error("CANNOT FUCK OFF");
    console.log(colors.green(`HASH IS: ${hash}`));
    console.log(colors.blue(`Storing User: ${username} with hash: ${hash}`));
    DB.push("pwd", {
      username: username,
      hash: hash
    });
    console.log("Ensuring Hash was saved correctly...");
    let abd = DB.get("pwd");
    let user = abd.filter(vendor => vendor["username"] === username);
    pwdnsalt(password).verifyAgainst(user[0].hash, function(error, verified) {
      if (error) throw new Error("Something went wrong!");
      if (!verified) {
        console.log("Don't try! We got you!");
      } else {
        console.log(colors.green("Verified!"));
      }
    });
  });
};
