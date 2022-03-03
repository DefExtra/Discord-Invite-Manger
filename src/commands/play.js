const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  Client,
  CommandInteraction,
  MessageActionRow,
  MessageButton,
} = require("discord.js");
const player = require("../clients/player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription(
      "Loads your input and adds it to the queue; if there is no playing track, then it will start playing."
    )
    .addStringOption((option) =>
      option
        .setName("song")
        .setDescription(
          "the song url or name you wont to play."
        )
        .setRequired(true)
        .setAutocomplete(true)
    ),

  /**
   *
   * @param {Client} client
   * @param {CommandInteraction<import("discord.js").CacheType>} interaction
   */

  run: (client, interaction) => {
    let song = interaction.options.getString("song");
    player.play(interaction, song);
  },
};
