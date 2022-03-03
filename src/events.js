const fs = require("fs");
const chalk = require("chalk");
const { Client } = require("discord.js");

/**
 * 
 * @param {Client} client 
 */

module.exports = async (client) => {
  fs.readdir(__dirname + "/events/", (err, files) => {
    if (err) return console.log(chalk.red.bold(err));
    files.forEach(file => {
      if (!file.endsWith(".js")) return;
      const event = require(`${__dirname}/events/${file}`);
      let eventName = file.split(".")[0];
      console.log(
        chalk.green.bold("Loading Event: ") + chalk.red.bold(`"${eventName}"`)
      );
      client.on(eventName, event.bind(null, client));
    });
  });
}