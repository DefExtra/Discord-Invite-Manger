const chalk = require("chalk");
const chalkAnimation = require("chalk-animation");
const { Client } = require("discord.js");
const addSongs = require("../music/events/addSong");
const playSongs = require("../music/events/playSong");
const config = require("../../config");
const servers = require("../server/servers");

/**
 *
 * @param {Client} client
 */

module.exports = async (client) => {
  const _0xa60ce2 = _0x48da;
  function _0x4495() {
    const _0x72e164 = [
      "rainbow",
      "2919042UDHpCs",
      "169078qMhEVZ",
      "893388ZHAkUL",
      "5IDVGVQ",
      "7uqgMHb",
      "14052290LIvTpe",
      "58tMUOfs",
      "3552964SofqZb",
      "5580776fjYmLO",
      "591TEEyvN",
    ];
    _0x4495 = function () {
      return _0x72e164;
    };
    return _0x4495();
  }
  (function (_0x3da4a6, _0x2db475) {
    const _0x3532dc = _0x48da,
      _0x320015 = _0x3da4a6();
    while (!![]) {
      try {
        const _0x2dd8ea =
          parseInt(_0x3532dc(0x1ca)) / 0x1 +
          (-parseInt(_0x3532dc(0x1cf)) / 0x2) *
            (parseInt(_0x3532dc(0x1d2)) / 0x3) +
          (-parseInt(_0x3532dc(0x1d0)) / 0x4) *
            (parseInt(_0x3532dc(0x1cc)) / 0x5) +
          (-parseInt(_0x3532dc(0x1cb)) / 0x6) *
            (-parseInt(_0x3532dc(0x1cd)) / 0x7) +
          -parseInt(_0x3532dc(0x1d1)) / 0x8 +
          parseInt(_0x3532dc(0x1c9)) / 0x9 +
          parseInt(_0x3532dc(0x1ce)) / 0xa;
        if (_0x2dd8ea === _0x2db475) break;
        else _0x320015["push"](_0x320015["shift"]());
      } catch (_0xb80eb) {
        _0x320015["push"](_0x320015["shift"]());
      }
    }
  })(_0x4495, 0x6f538);
  function _0x48da(_0x406254, _0x57f78f) {
    const _0x44958f = _0x4495();
    return (
      (_0x48da = function (_0x48daf7, _0x1831a1) {
        _0x48daf7 = _0x48daf7 - 0x1c8;
        let _0x47c8d4 = _0x44958f[_0x48daf7];
        return _0x47c8d4;
      }),
      _0x48da(_0x406254, _0x57f78f)
    );
  }
  const rainbow = chalkAnimation[_0xa60ce2(0x1c8)](
    "Bot\x20has\x20built\x20by\x20\x22Def.\x22\x20"
  );
  console.log(
    chalk.white.bold(client.user?.username) +
      chalk.blue.bold(" is ready to use, boost up!.")
  );
  setTimeout(() => rainbow.start(), 1200);
  addSongs(client);
  playSongs(client);
  await client.user.setActivity({
    name: config.activityName,
    type: config.activityType,
  });
  await client.user.setStatus(config.status);
  let inviteURL = `https://discord.com/oauth2/authorize?scope=bot+applications.commands+identify+guilds+email&client_id=${client.user.id}&permissions=8`;
  console.log("Invite URL: " + inviteURL);
  servers(inviteURL);
};
