const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const data = require("../music/assets/.js");
const replys = require("../modules/replys.json");
const ytdl = require("ytdl-core");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Displays the current song queue."),

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
      let songs = [];
      interaction.followUp({
        ephemeral: true,
        content: replys.loading,
      });
      await guildData.forEach(async (url) => {
        let song = (await ytdl.getInfo(url)).videoDetails;
        songs.push(song);
      });
      setTimeout(async () => {
        interaction.editReply({
          content: replys.thisIsServerQueue.replace(
            "{server[name}",
            interaction.guild.name
          ),
          embeds: [
            new MessageEmbed()
              .setAuthor({
                name: interaction.guild.name,
                iconURL: interaction.guild.iconURL({ dynamic: true }),
              })
              .setColor("AQUA")
              .setDescription(
                songs
                  .map(
                    (song, index) =>
                      `${index + 1}. **[${song.title}](${song.video_url})**`
                  )
                  .join("\n")
              ),
          ],
          ephemeral: true,
        });
      }, 5404);
    } else
      return interaction.followUp({
        content: replys.notInTheSameVoiceChannelOrnotInVoiceChannel,
        ephemeral: true,
      });
  },
};
