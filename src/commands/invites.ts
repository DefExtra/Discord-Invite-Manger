import {
  Client,
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  User,
} from "discord.js";
import db from "quick.db";

export default {
  name: "invites",

  run: (client: Client, msg: Message) => {
    let user =
      msg.mentions.members?.first()?.user ||
      msg.guild?.members.cache.find(
        (member) => member.user.username == msg.content.split(" ")[1]
      )?.user ||
      msg.guild?.members.cache.find(
        (member) => member.user.id == msg.content.split(" ")[1]
      )?.user ||
      msg.author;
    let data: {
      invitedBy: User | any;
      invites: number;
      users: User[] | null;
      fake: number;
      leaves: number;
      bouns: number;
      all: number;
    } = db.fetch(`Invites_${msg?.guildId}_${user.id}`);
    if (data == null)
      data = {
        invitedBy: null,
        invites: 0,
        users: null,
        fake: 0,
        leaves: 0,
        bouns: 0,
        all: 0,
      };
    let raw = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("users")
        .setLabel("users ❓")
        .setStyle("DANGER")
    );
    msg
      .reply({
        components: [raw],
        embeds: [
          new MessageEmbed()
            .setColor(0x00e8ff)
            .setDescription(
              `You have **${data.invites}** invites! (**${data.all} **regular, **${data.bouns}** bonus, **${data.fake} ** fake, **${data.leaves} ** leaves)`
            )
            //.setThumbnail(user.avatarURL({ dynamic: true }) || "")
            //   .setFields(
            //     {
            //       name: "all:",
            //       value: String(data.all),
            //       inline: true,
            //     },
            //     {
            //       name: "regular:",
            //       value: String(data.invites),
            //       inline: true,
            //     },
            //     {
            //       name: "fake:",
            //       value: String(data.fake),
            //       inline: true,
            //     },
            //     {
            //       name: "leaves:",
            //       value: String(data.leaves),
            //       inline: true,
            //     },
            //     {
            //       name: "bouns:",
            //       value: String(data.bouns),
            //       inline: true,
            //     }
            //   )
            .setFooter({
              text: `Invited By: ${
                data.invitedBy ? data.invitedBy?.username : ""
              }`,
            }),
        ],
      })
      .then((message) => {
        let collector = message.createMessageComponentCollector({
          filter: (i) => i.user.id == msg.author.id,
          max: 100,
          time: 1000 * 60 * 60 * 24,
        });
        collector.on("collect", (i) => {
          if (i.customId == "users") {
            i.reply({
              ephemeral: true,
              content: data.users
                ?.map(
                  (value, index) => `${index}. ${value.username} (${value.id})`
                )
                .join("\n") + "\n_ _",
            });
          }
        });
      });
  },
};
