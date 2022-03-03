const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction } = require("discord.js");
const data = require("../music/assets/.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription(
      "Stops the currently playing track and returns to the beginning of the queue."
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
      if (guildData) guildData.connection.destroy(true);
      data.delete(button.guild.id);
      interaction.followUp({
        content: replys.musicStoped,
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
