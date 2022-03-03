const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction } = require("discord.js");
const replys = require("../modules/replys.json");
const data = require("../music/assets/.js");
const lyricsFinder = require("lyrics-finder");
const ytdl = require("ytdl-core");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("nowplaying")
    .setDescription("Displays the current playing track."),

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
      let currentSong = guildData[0];
      let song = (await ytdl.getInfo(currentSong)).videoDetails;
      interaction.followUp({
        content: replys.np
          .replace("{song[title]}", song.title)
          .replace("{song[url]}", song.url),
        ephemeral: true,
      });
    } else
      return interaction.followUp({
        content: replys.notInTheSameVoiceChannelOrnotInVoiceChannel,
        ephemeral: true,
      });
  },
};
