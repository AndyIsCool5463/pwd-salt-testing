require("dotenv").config();
const pwdnsalt = require("password-hash-and-salt");
module.exports = (ui, DB, Username, password) => {
  DB.deleteAll();
  console.log(colors.rainbow("Databased DUMPED! 👏👏👏👏"));
};
