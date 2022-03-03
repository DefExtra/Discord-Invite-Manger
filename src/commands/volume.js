const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction } = require("discord.js");
const data = require("../music/assets/.js");
const replys = require("../modules/replys.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("volume")
    .setDescription("Sets the player's volume.")
    .addNumberOption((option) =>
      option
        .setName("new_volume")
        .setDescription("the new volume deg.")
        .setRequired(true)
    ),

  /**
   *
   * @param {Client} client
   * @param {CommandInteraction<import("discord.js").CacheType>} interaction
   */

  run: (client, interaction) => {
    if (!interaction.guild.me.voice.channel)
      return interaction.followUp({
        content: replys.noPlayingMusic,
        ephemeral: true,
        allowedMentions: {
          repliedUser: false,
        },
      });
    if (
      interaction.member.voice.channel &&
      interaction.guild.me.voice.channel.id ==
        interaction.member.voice.channel.id
    ) {
      let guildData = data.get(interaction.guildId);
      if (!guildData)
        return interaction.followUp({
          content: replys.noServerQueue,
          ephemeral: true,
        });
      let res = require("../music/functions/play").resource;
      res.volume.setVolume(interaction.options.getNumber("new_volume"));
      interaction.followUp({
        content: replys.volumeUpdate.replace(
          "{volume[volume]}",
          res.volume.volume
        ),
        ephemeral: true,
        allowedMentions: {
          repliedUser: false,
        },
      });
    } else
      return interaction.followUp({
        content: replys.notInTheSameVoiceChannelOrnotInVoiceChannel,
        ephemeral: true,
      });
  },
};
