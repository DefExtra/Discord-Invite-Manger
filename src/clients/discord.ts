import { Client, Intents } from "discord.js";

export default new Client({
  intents: new Intents(32767),
  allowedMentions: {
    repliedUser: false,
  },
  partials: [
    "CHANNEL",
    "GUILD_MEMBER",
    "GUILD_SCHEDULED_EVENT",
    "MESSAGE",
    "REACTION",
    "USER",
  ],
  shards: "auto",
});
