require("dotenv").config();
const pwdnsalt = require("password-hash-and-salt");
const colors = require("colors/safe");
const moment = require("moment");
const fs = require("fs-extra");
colors.setTheme({
  silly: "rainbow",
  input: "grey",
  verbose: "cyan",
  prompt: "grey",
  info: "green",
  data: "grey",
  help: "cyan",
  warn: "yellow",
  debug: "blue",
  error: "red"
});
module.exports = (ui, DB, Username, password) => {
  let old = DB.get("pwd");
  const questions = [
    {
      type: "confirm",
      name: "confirmed",
      message: "Are you sure you want to delete DB?"
    },
    {
      type: "password",
      name: "pwd",
      message: "Enter Password.",
      validate: str => {
        if (str != process.env.ADMINPASS) {
          return false;
        } else {
          return true;
        }
      }
    }
  ];
  const questions2 = [
    {
      type: "confirm",
      name: "save",
      message: "Do you want a copy of the old DB?"
    }
  ];
  ui.prompt(questions, async e => {
    if (e.confirmed === true) {
      DB.deleteAll();
      ui.writeInfoLine(colors.rainbow("Databased DUMPED! 👏👏👏👏"));
      ui.prompt(questions2, async e => {
        if (e.save === true) {
          const abc = await getShit();
          console.log(
            colors.help(`Database can be viewed in `) +
              colors.italic(`./old/${abc}`)
          );
          await fs.outputFile(`./old/${abc}.old`, JSON.stringify(old), err => {
            if (err) return ui.writeError(err);
          });
        }
      });
    } else {
      ui.writeInfoLine("Crysis Averted phew... 👏👏👏");
    }
  });
};

const getShit = async () => {
  const date = new Date();
  var months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  const year = date.getFullYear();
  const month = date.getMonth();
  const minute = date.getMinutes();
  const cdate = date.getDate();
  const hours = date.getHours();
  const folder = `${months[month]} ${cdate},${year} ${
    getClockTime(date).hour
  }꞉${getClockTime(date).minute}${getClockTime(date).ap}`;
  return folder;
};
function getClockTime(date) {
  var now = date;
  var hour = now.getHours();
  var minute = now.getMinutes();
  var second = now.getSeconds();
  var ap = "AM";
  if (hour > 11) {
    ap = "PM";
  }
  if (hour > 12) {
    hour = hour - 12;
  }
  if (hour == 0) {
    hour = 12;
  }
  if (hour < 10) {
    hour = "0" + hour;
  }
  if (minute < 10) {
    minute = "0" + minute;
  }
  if (second < 10) {
    second = "0" + second;
  }
  var timeString = hour + ":" + minute + ":" + second + " " + ap;
  return {
    hour: hour,
    minute: minute,
    second: second,
    ap: ap
  };
}
