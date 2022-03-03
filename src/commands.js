const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require("fs");
const chalk = require("chalk");

/**
 *
 * @param {Client} client
 * @param {Array} commands
 * @param {Array} commandsInfo
 */

module.exports = async (client, commands) => {
  const commandFiles = fs
    .readdirSync(__dirname + "/commands")
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const command = require(__dirname + `/commands/${file}`);
    commands.push(command.data.toJSON());
  }

  const rest = new REST({ version: "9" }).setToken(client?.token);
  try {
    console.log(
      chalk.yellow.bold("Started refreshing application (/) commands.")
    );

    await rest.put(Routes.applicationCommands(client.user.id), {
      body: commands,
    });
    console.log(
      chalk.green.bold("Successfully reloaded application (/) commands.")
    );
  } catch (error) {
    console.error(chalk.red(error));
  }
};
