const player = require("../../clients/player");
const replys = require("../../modules/replys.json");

/**
 *
 * @param {Client} client
 */
module.exports = (client) => {
  player.events.on("addSong", (def, song) => {
    def.editReply({
      content: replys.doneAddedMusic
        .replace("{song[title]}", song.title)
        .replace("{song[url]}", song.url),
    });
  });
};
