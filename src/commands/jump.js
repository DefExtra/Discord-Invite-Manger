const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const data = require("../music/assets/.js");
const replys = require("../modules/replys.json");
const ytdl = require("ytdl-core");
const player = require("../clients/player.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("jump")
    .setDescription("Skips to the specified track.")
    .addNumberOption((option) =>
      option
        .setName("song_position")
        .setDescription("the song number in the queue you wont to skip.")
        .setRequired(true)
    ),

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
      let songs = data.get(interaction.guildId)?.songs;
      if (!songs)
        return interaction.followUp({
          content: replys.noServerQueue,
          ephemeral: true,
        });
      let newSong = null;
      let newSongs = [];
      let songIndex = interaction.options.getNumber("song_position") - 1;
      if (songIndex == 0)
        return interaction.followUp({
          ephemeral: true,
          content: replys.noSongsToJump,
        });
      interaction.followUp({
        ephemeral: true,
        content: replys.loading,
      });
      await songs.forEach((song, index) => {
        if (index == songIndex) {
          newSong = song;
        } else newSongs.push(song);
      });
      await setTimeout(async () => {
        songs = newSongs;
        if (newSong == null)
          return interaction.editReply({
            ephemeral: true,
            content: replys.noSongFound,
          });
        await player.play(interaction, newSong);
        let playerF = require("../music/functions/play").player;
        await playerF.stop();
        return interaction.editReply({
          ephemeral: true,
          content: replys.doneJumped.replace(
            "{song[index]}",
            String(songIndex + 1)
          ),
        });
      }, 1432);
    } else
      return interaction.followUp({
        content: replys.notInTheSameVoiceChannelOrnotInVoiceChannel,
        ephemeral: true,
      });
  },
};
