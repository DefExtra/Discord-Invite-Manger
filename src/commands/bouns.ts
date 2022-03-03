import {
  Client,
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  Permissions,
} from "discord.js";
import db from "quick.db";

export default {
  name: "bouns",

  run: (client: Client, msg: Message) => {
    if (msg.member?.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
      let functionR: any = null;
      msg
        .reply({
          content: "👀 | choose the bouns function from the bottons down blow:",
          components: [
            new MessageActionRow().addComponents(
              new MessageButton()
                .setCustomId("add")
                .setStyle("SECONDARY")
                .setLabel("add ➕"),
              new MessageButton()
                .setCustomId("remove")
                .setStyle("SECONDARY")
                .setLabel("remove ➖"),
              new MessageButton()
                .setCustomId("reset")
                .setStyle("SECONDARY")
                .setLabel("reset 🗑️")
            ),
          ],
        })
        .then((m) => {
          m.createMessageComponentCollector({
            filter: (i) => i.user.id == msg.author.id,
            max: 1,
            time: 1000 * 60 * 60,
          }).on("collect", (i) => {
            functionR = i.customId;
            m.edit({
              content: "👀 | type the user id/name:",
              components: [],
            }).then((mm) => {
              mm.channel
                .createMessageCollector({
                  filter: (m) => m.author.id == msg.author.id,
                  max: 1,
                  time: 1000 * 60 * 60,
                })
                .on("collect", (M) => {
                  M.delete().catch(() => {});
                  let user =
                    msg.guild?.members.cache.find((u) => u.id == M.content) ||
                    msg.guild?.members.cache.find(
                      (u) => u.user.username == M.content
                    );
                  if (!user)
                    mm.edit({
                      content: ":x: | i can't find this user",
                    });
                  else {
                    if (functionR == "add") {
                      mm.edit({
                        content:
                          "👀 | choose the bouns coins you wont to add from the bottons down blow:",
                        components: [
                          new MessageActionRow().addComponents(
                            new MessageButton()
                              .setCustomId("1")
                              .setStyle("SECONDARY")
                              .setLabel("1 ➕"),
                            new MessageButton()
                              .setCustomId("5")
                              .setStyle("SECONDARY")
                              .setLabel("5 ➕"),
                            new MessageButton()
                              .setCustomId("10")
                              .setStyle("SECONDARY")
                              .setLabel("10 ➕"),
                            new MessageButton()
                              .setCustomId("50")
                              .setStyle("SECONDARY")
                              .setLabel("50 ➕"),
                            new MessageButton()
                              .setCustomId("100")
                              .setStyle("SECONDARY")
                              .setLabel("100 ➕")
                          ),
                        ],
                      }).then((mmm) => {
                        mmm
                          .createMessageComponentCollector({
                            filter: (i) => i.user.id == msg.author.id,
                            max: 1,
                            time: 1000 * 60 * 60,
                          })
                          .on("collect", (i) => {
                            db.add(
                              `Invites_${msg.guild?.id}_${user?.id}.bouns`,
                              Number(i.customId)
                            );
                            mmm.edit({
                              content:
                                "✅ | done add " +
                                i.customId +
                                " bouns points to `" +
                                user?.user.username +
                                "`",
                              components: [],
                            });
                          });
                      });
                    } else if (functionR == "remove") {
                      mm.edit({
                        content:
                          "👀 | choose the bouns coins you wont to remove from the bottons down blow:",
                        components: [
                          new MessageActionRow().addComponents(
                            new MessageButton()
                              .setCustomId("1")
                              .setStyle("SECONDARY")
                              .setLabel("1 ➖"),
                            new MessageButton()
                              .setCustomId("5")
                              .setStyle("SECONDARY")
                              .setLabel("5 ➖"),
                            new MessageButton()
                              .setCustomId("10")
                              .setStyle("SECONDARY")
                              .setLabel("10 ➖"),
                            new MessageButton()
                              .setCustomId("50")
                              .setStyle("SECONDARY")
                              .setLabel("50 ➖"),
                            new MessageButton()
                              .setCustomId("100")
                              .setStyle("SECONDARY")
                              .setLabel("100 ➖")
                          ),
                        ],
                      }).then((mmm) => {
                        mmm
                          .createMessageComponentCollector({
                            filter: (i) => i.user.id == msg.author.id,
                            max: 1,
                            time: 1000 * 60 * 60,
                          })
                          .on("collect", (i) => {
                            db.subtract(
                              `Invites_${msg.guild?.id}_${user?.id}.bouns`,
                              Number(i.customId)
                            );
                            mmm.edit({
                              content:
                                "✅ | done remove " +
                                i.customId +
                                " bouns points from `" +
                                user?.user.username +
                                "`",
                              components: [],
                            });
                          });
                      });
                    } else if (functionR == "reset") {
                      let old = db.fetch(
                        `Invites_${msg.guild?.id}_${user?.id}`
                      );
                      db.set(`Invites_${msg.guild?.id}_${user?.id}`, {
                        invitedBy: old.invitedBy,
                        invites: old.invites,
                        users: old.users,
                        fake: old.fake,
                        leaves: old.leaves,
                        bouns: 0,
                        all: old.all,
                      });
                      mm.edit({
                        content:
                          "✅ | done reset all the bouns points from `" +
                          user?.user.username +
                          "`",
                        components: [],
                      });
                    }
                  }
                });
            });
          });
        });
    } else
      return msg.reply({
        content: ":x: | you must have a **ADMINISTRATOR** to use this command.",
      });
  },
};
