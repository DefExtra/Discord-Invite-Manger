import { GuildBasedChannel, MessageEmbed } from "discord.js";
import discord from "../../clients/discord";
import db from "quick.db";
import tracking from "./tracking";

export default class {
  constructor(
    commands: Map<string, any>,
    configs: { token: string; prefix: string }
  ) {
    tracking(discord);
    discord.login(configs.token).catch((err) => console.log(err));
    discord
      .on("ready", () => console.log(discord.user?.username + " is trying.."))
      .on("messageCreate", (msg) => {
        if (
          msg.author.bot ||
          msg.channel.type == "DM" ||
          !msg.content ||
          !msg.content.startsWith(configs.prefix)
        )
          return;
        let commandName = msg.content.split(" ")[0].split(configs.prefix)[1];
        let command = commands.get(commandName);
        if (command) command?.run(discord, msg);
      })
      .on("guildMemberRemove", (member) => {
        let data = db.fetch(`Invites_${member?.guild.id}_${member.user.id}`);
        if (data == null || data?.invitedBy == null) return;
        let inviterData = db.fetch(
          `Invites_${member?.guild.id}_${data?.invitedBy.id}`
        );
        console.table({
          invitedBy: inviterData.invitedBy,
          invites: inviterData.invites - 1,
          users: inviterData.users,
          fake: inviterData.fake,
          leaves: inviterData.leaves + 1,
          bouns: inviterData.bouns,
          all: inviterData.all,
        });
        setTimeout(() => {
          db.set(`Invites_${member?.guild.id}_${data?.invitedBy.id}`, {
            invitedBy: inviterData.invitedBy,
            invites: inviterData.invites - 1,
            users: inviterData.users,
            fake: inviterData.fake,
            leaves: inviterData.leaves + 1,
            bouns: inviterData.bouns,
            all: inviterData.all,
          });
        }, 1444);
        let leaveData: {
          channel: GuildBasedChannel | undefined;
          toggle: boolean;
          msg: string;
        } = db.fetch(`Leave_${member?.guild.id}`);
        let guild = discord.guilds.cache.get(member.guild.id || "");
        let leaveNullData: {
          channel: GuildBasedChannel | undefined;
          toggle: boolean;
          msg: string;
        } = {
          channel: guild?.channels.cache
            .map((value) => value)
            .filter((channel) => channel.type == "GUILD_TEXT")
            .slice(0, 1)[0],
          toggle: true,
          msg: "GodBay {member[mention]}! You were invited by {invite[inviter[username]]}!",
        };
        if (leaveData == null) leaveData = leaveNullData;
        db.set(`Leave_${member.guild.id}`, leaveData);
        let channel: any = guild?.channels.cache.get(
          leaveData.channel?.id || ""
        );
        let msg = leaveData.msg
          .replace("{member[mention]}", `<@!${member.id}>`)
          .replace("{member[id]}", `${member.id}`)
          .replace("{member[username]}", `${member.user.username}`)
          .replace("{invite[inviter[id]]}", `${data.invitedBy?.id}`)
          .replace("{invite[inviter[username]]}", `${data.invitedBy?.username}`)
          .replace("{invite[inviter[mention]]}", `<@!${data.invitedBy?.id}>`);
        let embed = db.fetch(`Embed_${member.guild.id}`) || {
          toggle: false,
          color: null,
        };
        if (embed?.toggle == true)
          channel.send({
            embeds: [
              new MessageEmbed().setColor(embed.color).setDescription(msg),
            ],
          });
        else channel.send(msg);
      });
  }
}
