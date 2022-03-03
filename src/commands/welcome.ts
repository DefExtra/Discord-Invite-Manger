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
  name: "welcome",

  run: (client: Client, msg: Message) => {
    if (
      msg.member?.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS) &&
      msg.member?.permissions.has(Permissions.FLAGS.MANAGE_GUILD)
    ) {
      let toggleR: any = null;
      let channelR: any = null;
      let messageR: any = null;
      let row = new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId("false")
          .setLabel("off!")
          .setStyle("DANGER"),
        new MessageButton()
          .setCustomId("true")
          .setLabel("on!")
          .setStyle("SUCCESS")
      );
      msg
        .reply({
          content: "👀 | please choose the toggle from the buttons down blow:",
          components: [row],
        })
        .then((messageOne) => {
          let collector = messageOne.createMessageComponentCollector({
            filter: (i) => i.user.id == msg.author.id,
            max: 1,
            time: 1000 * 60 * 60 * 24,
          });
          collector.on("collect", (i) => {
            if (i.customId == "false") toggleR = false;
            if (i.customId == "true") toggleR = true;
            i.channel?.messages.fetch(i.message.id).then((m) => {
              m.edit({
                content: "👀 | please type the welcome channel name/id:",
                components: [],
              }).then((messageTwo) => {
                let collector = messageTwo.channel.createMessageCollector({
                  filter: (m) => m.author.id == msg.author.id,
                  max: 1,
                  time: 1000 * 60 * 60 * 24,
                });
                collector.on("collect", (m) => {
                  m.delete().catch(() => {});
                  let channel =
                    msg.guild?.channels.cache.find((c) => c.id == m.content) ||
                    msg.guild?.channels.cache.find((c) => c.name == m.content);
                  m.channel.messages.fetch(messageTwo.id).then((m) => {
                    if (!channel)
                      m.edit({
                        content: ":x: | i can't find this channel",
                      });
                    else {
                      channelR = channel;
                      m.edit({
                        content:
                          "👀 | please type the welcome message\n\nkey words:\n{member[mention]} --> mention the user\n{member[id]} --> id of the user\n{member[username]} --> username of the user\n{invite[url]} --> the invite url\n{invite[uses]} --> the invite url uses\n{invite[inviter[id]]} --> the id of inviter\n{invite[inviter[username]]} --> the username of the inviter\n{invite[inviter[mention]]} --> the inviter mention",
                      }).then((messageThree) => {
                        let collector =
                          messageThree.channel.createMessageCollector({
                            filter: (m) => m.author.id == msg.author.id,
                            max: 1,
                            time: 1000 * 60 * 60 * 24,
                          });
                        collector.on("collect", (m) => {
                          messageR = m.content;
                          m.channel.messages
                            .fetch(messageThree.id)
                            .then((m) => {
                              m.edit({
                                content: "the welcome config has been set as:",
                                embeds: [
                                  new MessageEmbed()
                                    .setColor(0x00e8ff)
                                    .addFields(
                                      {
                                        name: "toggle:",
                                        value: String(toggleR),
                                        inline: true,
                                      },
                                      {
                                        name: "channel:",
                                        value: String(channelR?.name),
                                        inline: true,
                                      },
                                      {
                                        name: "message:",
                                        value: String(messageR),
                                        inline: true,
                                      }
                                    ),
                                ],
                              });
                              let newWelcomeData = {
                                channel: channelR,
                                toggle: toggleR,
                                msg: messageR,
                              };
                              db.set(`Welcome_${msg?.guildId}`, newWelcomeData);
                            });
                        });
                      });
                    }
                  });
                });
              });
            });
          });
        });
    } else
      return msg.reply({
        content:
          ":x: | you must have a **MANAGE_CHANNELS** and **MANAGE_GUILD** to use this command.",
      });
  },
};
