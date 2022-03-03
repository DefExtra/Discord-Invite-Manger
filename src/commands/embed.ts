import {
  Client,
  Message,
  MessageEmbed,
  Permissions,
  MessageActionRow,
  MessageButton,
  MessageSelectMenu,
  SelectMenuInteraction,
} from "discord.js";
import db from "quick.db";

export default {
  name: "embed",

  run: (client: Client, msg: Message) => {
    if (
      msg.member?.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS) &&
      msg.member?.permissions.has(Permissions.FLAGS.MANAGE_GUILD)
    ) {
      let options: any[] = [];
      [
        "DEFAULT",
        "WHITE",
        "AQUA",
        "GREEN",
        "BLUE",
        "YELLOW",
        "PURPLE",
        "LUMINOUS_VIVID_PINK",
        "FUCHSIA",
        "GOLD",
        "ORANGE",
        "RED",
        "GREY",
        "NAVY",
        "BLURPLE",
        "GREYPLE",
        "DARK_BUT_NOT_BLACK",
        "NOT_QUITE_BLACK",
        "RANDOM",
      ].forEach((color) => {
        options.push({
          label: color,
          value: color,
        });
      });
      let toogleR: any = null;
      let colorR: any = null;
      let rowM = new MessageActionRow().addComponents(
        new MessageSelectMenu()
          .setCustomId("colors")
          .setMinValues(1)
          .setMaxValues(1)
          .setPlaceholder("click to select for embed colors")
          .setOptions(options)
      );
      let rowB = new MessageActionRow().addComponents(
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
          content: "👀 please choose the toggle from the buttons down blow:",
          components: [rowB],
        })
        .then((messageOne) => {
          let collector = messageOne.createMessageComponentCollector({
            filter: (i) => i.user.id == msg.author.id,
            max: 1,
            time: 1000 * 60 * 60 * 24,
          });
          collector.on("collect", async (i) => {
            await i.deferUpdate().catch(() => {});
            if (i.customId == "false") toogleR = false;
            if (i.customId == "true") toogleR = true;
            messageOne
              .edit({
                content:
                  "👀 please choose the embed color from the menu down blow:",
                components: [rowM],
              })
              .then((messageTwo) => {
                let collector = messageTwo.createMessageComponentCollector({
                  filter: (i) => i.user.id == msg.author.id,
                  max: 1,
                  time: 1000 * 60 * 60 * 24,
                });
                collector.on("collect", (i: SelectMenuInteraction) => {
                  let color = i.values[0];
                  colorR = color;
                  messageTwo
                    .edit({
                      content: "the embed config has been set as:",
                      embeds: [
                        new MessageEmbed().setColor(0x00e8ff).addFields(
                          {
                            name: "toggle:",
                            value: String(toogleR),
                            inline: true,
                          },
                          {
                            name: "color:",
                            value: String(colorR),
                            inline: true,
                          }
                        ),
                      ],
                      components: [],
                    })
                    .then(() => {
                      db.set(`Embed_${msg.guildId}`, {
                        toggle: toogleR,
                        color: colorR,
                      });
                    });
                });
              });
          });
        });
    } else
      return msg.reply({
        content:
          ":x: you must have a **MANAGE_CHANNELS** and **MANAGE_GUILD** to use this command.",
      });
  },
};
