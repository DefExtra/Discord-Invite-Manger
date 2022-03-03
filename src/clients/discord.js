const Discord = require("discord.js");

module.exports = new Discord.Client({
  intents: new Discord.Intents(32767),
  allowedMentions: {
    repliedUser: false
  }
});
