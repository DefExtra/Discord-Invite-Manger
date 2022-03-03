const { Client, CommandInteraction } = require("discord.js");

/**
 *
 * @param {Client} client
 * @param {CommandInteraction} interaction
 */
module.exports = async (client, interaction) => {
  if (interaction.isCommand()) {
    try {
      let command = require("../commands/" + interaction.commandName);
      await interaction
        .deferReply({
          ephemeral: true,
          fetchReply: true,
        })
        .catch(() => {});
      if (command) command.run(client, interaction);
    } catch (err) {
      return;
    }
  }
};
