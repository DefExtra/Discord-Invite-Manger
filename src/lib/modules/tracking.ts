import {
  Client,
  GuildBasedChannel,
  GuildMember,
  MessageEmbed,
} from "discord.js";
import tracker from "../../clients/tracker";
import db from "quick.db";

async function tracking(discord?: Client) {
  tracker.on(
    "guildMemberAdd",
    (
      member: GuildMember,
      joinType: "normal" | "vanity" | "permissions" | "unknown",
      invite
    ) => {
      if (joinType == "normal") {
        let fake = true;
        let d = new Date(member.user.createdAt);
        if (d.getFullYear() >= 0 || d.getMonth() >= 2) fake = false;
        if (member.user.id == invite?.inviter?.id) fake = true;
        db.set(`Invites_${invite?.guildId}_${member.user.id}`, {
          invitedBy: invite?.inviter,
          invites: 0,
          users: [],
          fake: 0,
          leaves: 0,
          bouns: 0,
          all: 0,
        });
        let check = db.fetch(
          `Invites_${invite?.guildId}_${invite?.inviter?.id}`
        );
        if (check == null)
          db.set(`Invites_${invite?.guildId}_${invite?.inviter?.id}`, {
            invitedBy: null,
            invites: fake ? 0 : 1,
            users: [member.user],
            fake: fake ? 1 : 0,
            leaves: 0,
            bouns: 0,
            all: 1,
          });
        else {
          db.set(`Invites_${invite?.guildId}_${invite?.inviter?.id}`, {
            invitedBy: check.invitedBy,
            invites: fake ? check.invites : check.invites + 1,
            users: [member.user],
            fake: fake ? 1 : check.fake,
            leaves: check.leaves,
            bouns: check.bouns,
            all: check.all + 1,
          });
        }
        let welcomeData: {
          channel: GuildBasedChannel | undefined;
          toggle: boolean;
          msg: string;
        } = db.fetch(`Welcome_${invite?.guildId}`);
        let guild = discord?.guilds.cache.get(invite?.guildId || "");
        let welcomeNullData: {
          channel: GuildBasedChannel | undefined;
          toggle: boolean;
          msg: string;
        } = {
          channel: guild?.channels.cache
            .map((value) => value)
            .filter((channel) => channel.type == "GUILD_TEXT")
            .slice(0, 1)[0],
          toggle: true,
          msg: "Welcome {member[mention]}! You were invited by {invite[inviter[username]]}!",
        };
        if (welcomeData == null) welcomeData = welcomeNullData;
        db.set(`Welcome_${invite?.guildId}`, welcomeData);
        let channel: any = guild?.channels.cache.get(
          welcomeData.channel?.id || ""
        );
        let msg = welcomeData.msg
          .replace("{member[mention]}", `<@!${member.id}>`)
          .replace("{member[id]}", `${member.id}`)
          .replace("{member[username]}", `${member.user.username}`)
          .replace("{invite[url]}", `${invite?.url}`)
          .replace("{invite[uses]}", `${invite?.uses}`)
          .replace("{invite[inviter[id]]}", `${invite?.inviter?.id}`)
          .replace(
            "{invite[inviter[username]]}",
            `${invite?.inviter?.username}`
          )
          .replace("{invite[inviter[mention]]}", `<@!${invite?.inviter?.id}>`);
        let embed = db.fetch(`Embed_${invite?.guildId}`) || {
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
      } else console.log(joinType);
    }
  );
}

export default tracking;
