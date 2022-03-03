import { Client, Message, MessageEmbed, User } from "discord.js";
import db from "quick.db";

export default {
  name: "leaderboard",

  run: (client: Client, msg: Message) => {
    let tempUsers: User[] = [];
    msg.guild?.members.cache.forEach((member) => {
      tempUsers.push(member.user);
    });
    let tempLength = tempUsers.length;
    let usersContent = 0;
    let usersMaxContent = 21;
    let tempData: any[] = [];

    for (let i = 0; i < tempLength; i++) {
      var data = db.fetch(`Invites_${msg?.guildId}_${tempUsers[i].id}`);
      var regular = data?.invites;
      if (regular == null || undefined) continue;
      if (regular == 0) continue;
      var all = data?.all;
      if (all == null || undefined) continue;
      var bouns = data?.bouns;
      if (bouns == null || undefined) continue;
      var fake = data?.fake;
      if (fake == null || undefined) continue;
      var leaves = data?.leaves;
      if (leaves == null || undefined) continue;
      tempData.push({
        user: tempUsers[i],
        real: regular,
        all: all,
        bouns: bouns,
        fake: fake,
        leaves: leaves,
      });
    }
    setTimeout(() => {
      const leaderboardData = [];
      tempData.sort((a, b) => b.real - a.real);
      tempData.sort((a, b) => b.all - a.all);
      tempData.sort((a, b) => b.bonus - a.bouns);
      tempData.sort((a, b) => b.fake - a.fake);
      tempData.sort((a, b) => b.leaves - a.leaves);

      for (let k = 0; k < tempData.length; k++) {
        usersContent++;
        if (usersContent >= usersMaxContent) continue;
        leaderboardData.push(
          `${k + 1}. **<@!${tempData[k].user.id}>** - **${
            tempData[k].real
          }** invites (**${tempData[k].all}** reqular, **${
            tempData[k].bouns
          }** bouns, **${tempData[k].fake}** fake, **${
            tempData[k].leaves
          }** leaves)`
        );
      }

      var topValue = leaderboardData.join("\n");
      msg.reply({
        embeds: [
          new MessageEmbed()
            .setAuthor({
              name: `${msg.guild?.name} - Leaderboard`,
              iconURL: msg.guild?.iconURL({ dynamic: true }) || "",
            })
            .setThumbnail(msg.guild?.iconURL({ dynamic: true }) || "")
            .setColor("#2F3136")
            .setDescription(topValue) // "✅ : real \n♾️ : all \n✨ : bonus \n🤖 : fake\n❌ : leaves  \n\n" +
            .setFooter({
              text: client.user?.username || "",
              iconURL: client.user?.avatarURL({ dynamic: true }) || "",
            })
            .setTimestamp(),
        ],
      });
    }, 1234);
  },
};
