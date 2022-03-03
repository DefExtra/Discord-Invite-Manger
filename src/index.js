const client = require("./clients/discord");
const commands = [];
const config = require("../config");

(async function (client) {
  require("./events")(client);
  client.on("ready", () => require("./commands")(client, commands))
  client.on("error", (err) => console.log(err));
  client.on("messageCreate", (msg) => {
    if (msg.content.toLocaleLowerCase() == "casper") {
      msg.reply({
        files: [{
          attachment: "https://media.discordapp.net/attachments/928708617505472592/948691437913006111/unknown.png",
          name: "Casper.png"
        }],
      });
    }
  })
  client.login(config.token);
})(client);
