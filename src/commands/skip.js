const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction } = require("discord.js");
const replys = require("../modules/replys.json");
const data = require("../music/assets/.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skips to the next song."),

  /**
   *
   * @param {Client} client
   * @param {CommandInteraction<import("discord.js").CacheType>} interaction
   */

  run: async (client, interaction) => {
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
      let guildData = data.get(interaction.guildId)?.songs;
      if (!guildData)
        return interaction.followUp({
          content: replys.noServerQueue,
          ephemeral: true,
        });
      if (guildData && guildData?.length < 2)
        return interaction.followUp({
          content: replys.cantSkipSong,
          ephemeral: true,
          allowedMentions: {
            repliedUser: false,
          },
        });
      let player = require("../music/functions/play").player;
      player.stop();
      interaction.followUp({
        content: replys.doneSkipSong,
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
