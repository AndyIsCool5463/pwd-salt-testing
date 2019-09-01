const args = require("args");
const colors = require("colors");
const pwdnsalt = require("password-hash-and-salt");
const enmap = require("enmap");
const DB = new enmap({
  name: "SUPERSAFEDB"
});

DB.defer(() => {
  DB.ensure("pwd", []);
});
args
  .option("user", "username")
  .option("pass", "pwd")
  .command("type", "SALT / CHECK", "salt");

const flags = args.parse(process.argv);
if (flags.type == "salt") {
  pwdnsalt(flags.pass).hash((err, hash) => {
    if (err) return console.log(colors.red(`ERROR: \n \n ${err}`));
    console.log(colors.green(`HASH IS: ${hash}`));
    console.log(colors.blue(`Storing User: ${flags.user} with hash: ${hash}`));
    DB.push("pwd", {
      username: flags.user,
      hash: hash
    });
    console.log("Ensuring Hash was saved correctly...");
    let abd = DB.get("pwd");
    let user = abd.filter(vendor => vendor["username"] === flag.user);
    pwdnsalt(flag.pass).verifyAgainst(user.hash, function(error, verified) {
      if (error) throw new Error("Something went wrong!");
      if (!verified) {
        console.log("Don't try! We got you!");
      } else {
        console.log(color.green("Verified!"));
      }
    });
  });
}
if (flags.type == "check") {
  let data = DB.get("pwd");
  let user = abd.filter(e => e["username"] === flag.user);
  if (!user) return console.log(color.red("No user found."));
  pwdnsalt(flag.pass).verifyAgainst(user.hash, (err, verified) => {
    if (err) throw new Error("something went wrong");
    if (!verified) {
      console.log(color.red("WRONG PASSWORD TARD."));
    } else {
      console.log("Hi!");
    }
  });
}
