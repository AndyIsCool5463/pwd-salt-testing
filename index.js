require("dotenv").config();
const args = require("args");
const colors = require("colors");
const pwdnsalt = require("password-hash-and-salt");
const enmap = require("enmap");
const DB = new enmap({
  name: "SUPERSAFEDB"
});
DB.defer.then(() => {
  DB.ensure("pwd", []);
});
args
  .option(
    "user",
    "username",
    "ABCBUHCljukahegawjkerhglkeqwrhlqukrhglqkjhrfglkjhl"
  )
  .option("pass", "pwd", "HIHLGJHKLHLKUHLKJHLKJHLK")
  .option("type", "SALT / CHECK / DUMP", "42069")
  .command("RUN", "runagsagjhals", ["r"]);

const flags = args.parse(process.argv);
if (flags.type == "salt") {
  pwdnsalt(flags.pass).hash(process.env.SALT, (err, hash) => {
    if (err) return console.log(colors.red(`ERROR: \n \n ${err}`));
    if (
      DB.get("pwd").filter(vendor => vendor["username"] === flags.user).length >
      0
    )
      return console.error("CANNOT FUCK OFF");
    console.log(colors.green(`HASH IS: ${hash}`));
    console.log(colors.blue(`Storing User: ${flags.user} with hash: ${hash}`));
    DB.push("pwd", {
      username: flags.user,
      hash: hash
    });
    console.log("Ensuring Hash was saved correctly...");
    let abd = DB.get("pwd");
    let user = abd.filter(vendor => vendor["username"] === flags.user);
    console.log(user);
    pwdnsalt(flags.pass).verifyAgainst(user[0].hash, function(error, verified) {
      console.log(flags.pass, user.hash);
      if (error) throw new Error("Something went wrong!");
      if (!verified) {
        console.log("Don't try! We got you!");
      } else {
        console.log(colors.green("Verified!"));
      }
    });
  });
}
if (flags.type == "check") {
  let data = DB.get("pwd");
  let user = data.filter(e => e["username"] === flags.user);
  if (!user || user.length == 0)
    return console.log(colors.red("No user found."));
  console.log(user);
  pwdnsalt(flags.pass).verifyAgainst(user[0].hash, (err, verified) => {
    console.log(flags.pass);
    if (err) throw new Error("something went wrong");
    if (!verified) {
      console.log(colors.red("WRONG PASSWORD TARD."));
    } else {
      console.log("Hi!");
    }
  });
}
if (flags.type == "DUMP") {
  DB.deleteAll();
  console.log(colors.rainbow("Databased DUMPED! 👏👏👏👏"));
}
