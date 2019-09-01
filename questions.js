module.exports = [
  {
    type: "input",
    name: "Username",
    message: "Username"
  },
  {
    type: "password",
    name: "password",
    message: "Password"
  },
  {
    type: "list",
    name: "type",
    message: "Choose Type",
    choices: ["Salt", "Check", "Dump"]
  }
];
