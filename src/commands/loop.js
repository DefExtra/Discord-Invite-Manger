const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction } = require("discord.js");
const replys = require("../modules/replys.json");
const data = require("../music/assets/.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("loop")
    .setDescription("Starts looping your currently playing track."),

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
      if (guildData.loop == true) {
        guildData.loop = false;
      } else {
        guildData.loop = true;
      }
      interaction.followUp({
        content: replys.loopUpdate.replace("{loop[status]}", guildData.loop),
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
