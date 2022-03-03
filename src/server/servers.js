module.exports = (inviteURL) => {
  const express = require("express");
  const app = express();
  const chalk = require("chalk");

  app.set("views", __dirname + "/views");
  app.set("view engine", "pug");

  app
    .get("/", (req, res) => {
      res.render("index");
    })
    .get("/invite", (req, res) => res.redirect(inviteURL));

  app.listen(8154, () =>
    console.log(chalk.green.bold(`Server started at port 8154`))
  );
};
