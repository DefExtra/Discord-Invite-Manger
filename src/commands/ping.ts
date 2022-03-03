import { Client, Message, MessageEmbed } from "discord.js";

export default {
  name: "ping",

  run: (client: Client, msg: Message) => {
    var states = "🟢 Excellent";
    var states2 = "🟢 Excellent";
    var message = `${Date.now() - msg.createdTimestamp}`;
    var api = `${Math.round(client.ws.ping)}`;
    if (Number(msg) > 70) states = "🟢 Good";
    if (Number(msg) > 170) states = "🟡 Not Bad";
    if (Number(msg) > 350) states = "🔴 Soo Bad";
    if (Number(api) > 70) states2 = "🟢 Good";
    if (Number(api) > 170) states2 = "🟡 Not Bad";
    if (Number(api) > 350) states2 = "🔴 Soo Bad";
    msg.reply({
      embeds: [
        new MessageEmbed()
          .setColor(0x00e8ff)
          .setAuthor({
            name: "bot is pinging..",
            iconURL: msg.author.avatarURL({ dynamic: true }) || "",
          })
          .addField("**Time Taken:**", message + " ms 📶 | " + states, true)
          .addField("**WebSocket:**", api + " ms 📶 | " + states2, true)
          .setTimestamp()
          .setFooter({
            text: `Requested By ${msg.author.tag}`
          }),
      ],
    });
  },
};
