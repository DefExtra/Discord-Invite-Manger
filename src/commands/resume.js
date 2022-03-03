const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const data = require("../music/assets/.js");
const replys = require("../modules/replys.json");
const ytdl = require("ytdl-core");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("resume")
    .setDescription("Resumes playback."),

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
        if (guildData.pause == true) {
            require("../music/functions/play").player.unpause();
            guildData.pause = false;
            interaction.followUp({
                content: replys.doneResume,
                ephemeral: true,
                allowedMentions: {
                    repliedUser: false
                }
            });
          } else {
            interaction.followUp({
                content: replys.cantResume,
                ephemeral: true,
                allowedMentions: {
                    repliedUser: false
                }
            });
          }
    } else
      return interaction.followUp({
        content: replys.notInTheSameVoiceChannelOrnotInVoiceChannel,
        ephemeral: true,
      });
  },
};
