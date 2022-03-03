const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction, Permissions } = require("discord.js");
const voice = require("@discordjs/voice");
const replys = require("../modules/replys.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("connect")
    .setDescription("Connects the bot ro a voice channel."),

  /**
   *
   * @param {Client} client
   * @param {CommandInteraction<import("discord.js").CacheType>} interaction
   */

  run: async (client, interaction) => {
    if (
      interaction.member.voice.channel &&
      interaction.guild.me.voice.channel.id ==
        interaction.member.voice.channel.id
    ) {
      if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR))
        return interaction.followUp({
          content: replys.noParms,
          ephemeral: true,
        });
      const connection = await voice.joinVoiceChannel({
        channelId: interaction.member.voice.channel.id,
        guildId: interaction.guildId,
        adapterCreator: interaction.guild.voiceAdapterCreator,
        selfDeaf: true,
      });
      connection;
      interaction.followUp({
        content: replys.doneConnect.replace(
          "{voice[channel[mention]]}",
          `<#${interaction.member.voice.channel.id}>`
        ),
        ephemeral: true,
      });
    } else
      return interaction.followUp({
        content: replys.notInTheSameVoiceChannelOrnotInVoiceChannel,
        ephemeral: true,
      });
  },
};
