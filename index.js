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
const checkDB = require("./lib/checkDB");
const startServer = require("./lib/startServer");
const { spawn, Thread, Worker } = require("threads");

const ui = new UI({
  inputStream: process.stdin,
  outputStream: process.stdout,
  errorStream: process.stderr,
  writeLevel: "INFO",
  ci: false
});
ui.startProgress("Starting Application.");
const DB = new enmap({
  name: "SUPERSAFEDB",
  polling: true
});

DB.defer
  .then(() => {
    DB.ensure("pwd", []);

    //ui.startProgress("Starting Application.");
  })
  .then(() => ui.stopProgress())
  .then(() => {
    ui.prompt(
      [
        {
          type: "input",
          name: "Username",
          message: "Username"
        },
        {
          type: "password",
          name: "password",
          message: "Password"
        }
      ],
      e => {
        let { Username, password, type } = e;
        var ab = check(ui, DB, Username, password);
        if (ab == 1) {
          ui.writeError("No User Found!");
          ui.prompt(
            [
              {
                type: "confirm",
                name: "conf",
                message: "No User found, would you like to create one?"
              }
            ],
            e => {
              if (e.conf == true) {
                ui.prompt(
                  [
                    {
                      type: "input",
                      name: "Username",
                      message: "Username"
                    },
                    {
                      type: "password",
                      name: "password",
                      message: "Password"
                    }
                  ],
                  vv => {
                    const { Username, password } = vv;
                    salt(ui, DB, Username, password);
                    ui.writeInfoLine("Done");
                  }
                );
              }
            }
          );
        }
      }
    );
  });
// UI SETUP
//DB.set("pwd", defaultDB);
//ui.stopProgress();

// END UI SETUP
// test patcho.
