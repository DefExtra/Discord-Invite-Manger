const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction } = require("discord.js");
const replys = require("../modules/replys.json");
const player = require("../clients/player");
const data = require("../music/assets/.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("back")
    .setDescription("Skips to the previous song."),

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
      let guildData = data.get(interaction.guildId);
      if (!guildData)
        return interaction.followUp({
          content: replys.noServerQueue,
          ephemeral: true,
        });
      if (guildData?.last == null)
        return interaction.followUp({
          content: replys.cantBackSong,
          ephemeral: true,
          allowedMentions: {
            repliedUser: false,
          },
        });
      if (guildData?.last == guildData.songs[0])
      return interaction.followUp({
        content: replys.cantBackSong,
        ephemeral: true,
        allowedMentions: {
          repliedUser: false,
        },
      });
      player.play(interaction, guildData?.last)
    //   interaction.followUp({
    //     content: replys.doneLastSong,
    //     ephemeral: true,
    //     allowedMentions: {
    //       repliedUser: false,
    //     },
    //   });
    } else
      return interaction.followUp({
        content: replys.notInTheSameVoiceChannelOrnotInVoiceChannel,
        ephemeral: true,
      });
  },
};
