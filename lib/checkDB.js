require("dotenv").config();
const pwdnsalt = require("password-hash-and-salt");
const colors = require("colors");
const fs = require("fs-extra");
module.exports = (ui, DB, username, password) => {
  let length;
  try {
    length = DB.get("pwd").length;
  } catch (e) {
    length = 0;
  }
  const questions = [
    {
      type: "list",
      name: "type",
      message: "View Type",
      choices: ["Write to file.", "Write to Console. (Unstable for large DB)"]
    }
  ];
  const question2 = [
    {
      type: "input",
      name: "filename",
      message: "Save File Name (Saving at ./saves)"
    }
  ];
  ui.prompt(questions, e => {
    if (e.type == "Write to file.") {
      ui.prompt(question2, async e => {
        ui.startProgress(`Saving File. (${length} users.)`);
        await fs.outputFile(
          `./saves/${e.filename}.dbsave`,
          JSON.stringify(DB.get("pwd"))
        );
        ui.stopProgress();
      });
    } else {
      ui.writeInfoLine(JSON.stringify(DB.get("pwd"), null, 2));
    }
  });
};
