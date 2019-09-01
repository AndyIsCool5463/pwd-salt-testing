require("dotenv").config();
const UI = require("console-ui");
const args = require("args");
const colors = require("colors");
const pwdnsalt = require("password-hash-and-salt");
const enmap = require("enmap");
const inquirer = require("inquirer");
const questions = require("./questions");
const check = require("./lib/check");
const dump = require("./lib/dump");
const salt = require("./lib/salt");

const DB = new enmap({
  name: "SUPERSAFEDB"
});
DB.defer.then(() => {
  DB.ensure("pwd", []);
});
// UI SETUP

const ui = new UI({
  inputStream: process.stdin,
  outputStream: process.stdout,
  errorStream: process.stderr,
  writeLevel: "INFO",
  ci: true
});
ui.prompt(questions, e => {
  let { Username, password, type } = e;
  if (type === "Check") {
    check(ui, DB, Username, password);
  } else if (type === "Salt") {
    salt(ui, DB, Username, password);
  } else if (type === "Dump") {
    dump(ui, DB, Username, password);
  } else {
    ui.writeError("Invalid Type Entered.");
  }
});
// END UI SETUP
