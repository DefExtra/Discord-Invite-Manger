const ytdl = require("ytdl-core");
const voice = require("@discordjs/voice");
const { CommandInteraction } = require("discord.js");
const replys = require("../../modules/replys.json");
const yt = require("yt-search");
const SoundCloud = require("soundcloud-scraper");
const spotify = require("spotify-url-info");
const data = require("../assets/.js");

/**
 *
 * @param {CommandInteraction} interaction
 * @param {string} song
 */

module.exports.play = async (interaction, song) => {
  interaction
    .followUp({
      content: replys.tryingPlayMusic,
      ephemeral: true,
      allowedMentions: {
        repliedUser: false,
      },
    })
    .catch(() => {});
  if (interaction.guild.me.voice.channel) {
    if (interaction.member.voice.channel) {
      if (
        interaction.guild.me.voice.channel.id ==
        interaction.member.voice.channel.id
      ) {
        await songFilter(interaction, song);
      } else
        return interaction.editReply({
          content: replys.notInTheSameVoiceChannel,
          ephemeral: true,
          allowedMentions: {
            repliedUser: false,
          },
        });
    } else
      return interaction.editReply({
        content: replys.notInVoiceChannel,
        ephemeral: true,
        allowedMentions: {
          repliedUser: false,
        },
      });
  } else {
    if (interaction.member.voice.channel) {
      await songFilter(interaction, song);
    } else
      return interaction.editReply({
        content: replys.notInVoiceChannel,
        ephemeral: true,
        allowedMentions: {
          repliedUser: false,
        },
      });
  }
};

/**
 *
 * @param {CommandInteraction} interaction
 * @param {{
 *         playlist: boolean
 *         url: string | string[]
 *        }} song
 */
async function play(interaction, song) {
  let voiceChannel = interaction.member.voice.channel;
  if (song.playlist == false) {
    let url = song.url;
    let guildData = data.get(interaction.guildId);
    if (!guildData) {
      let queueConstructor = {
        vc: voiceChannel,
        connection: null,
        songs: [],
        pause: false,
        loop: false,
        last: null,
      };
      queueConstructor.songs.push(url);
      try {
        const connection = await voice.joinVoiceChannel({
          channelId: voiceChannel.id,
          guildId: interaction.guildId,
          adapterCreator: interaction.guild.voiceAdapterCreator,
          selfDeaf: false,
        });
        connection;
        connection.on("error", () => {
          return;
        });
        queueConstructor.connection = connection;
        data.set(interaction.guildId, queueConstructor);
        playerF(interaction, queueConstructor.songs[0]);
      } catch (err) {
        data.delete(interaction.guild.id);
        throw err;
      }
    } else {
      guildData.songs.push(song.url);
      try {
        let track = (await ytdl.getInfo(song.url)).videoDetails;
        if (track)
          require("../player").Events.emit("addSong", interaction, {
            title: track.title,
            author: track.author,
            url: track.video_url,
            id: track.videoId,
            duration: track.lengthSeconds,
            thumbnail: track.thumbnails[0].url,
            likes: track.likes,
            dislikes: track.dislikes,
            viewCount: track.viewCount,
            keywords: track.keywords,
          });
      } catch (err) {
        console.log(err);
      }
    }
  } else {
    return;
  }
}

/**
 *
 * @param {string} song
 */
async function songFilter(i, song) {
  if (song.includes("https://")) {
    if (song.includes("youtube.com") || song.includes("youtu.be"))
      play(i, {
        playlist: false,
        url: song,
      });
    else if (song.includes("soundcloud.com")) {
      let client = new SoundCloud.Client();
      let url = (await yt.search((await client.getSongInfo(song)).title))
        .videos[0].url;
      play(i, {
        playlist: false,
        url: url,
      });
    } else if (song.includes("spotify.com/track")) {
      let url = (await yt.search((await spotify.getPreview(song)).title))
        .videos[0].url;
      play(i, {
        playlist: false,
        url: url,
      });
    } else if (song.includes("spotify.com/playlist"))
      return interaction.editReply({
        content: replys.spotifyPlaylistIsNotAllowed,
        ephemeral: true,
        allowedMentions: {
          repliedUser: false,
        },
      });
    else
      return interaction.editReply({
        content: replys.notAllowedUrl,
        ephemeral: true,
        allowedMentions: {
          repliedUser: false,
        },
      });
  } else {
    let url = (await yt.search(song)).videos[0].url;
    play(i, {
      playlist: false,
      url: url,
    });
  }
}
/**
 *
 * @param {CommandInteraction} interaction
 * @param {string} song
 * @returns
 */
async function playerF(interaction, song) {
  let guildData = await data.get(interaction.guildId);
  if (!song) {
    if (guildData) guildData.connection.destroy(true);
    data.delete(interaction.guildId);
    return;
  }
  const player = await voice.createAudioPlayer({
    behaviors: {
      noSubscriber: voice.NoSubscriberBehavior.Pause,
    },
  });
  var stream = ytdl(song, { filter: "audioonly" });
  stream.on("error", (err) => console.log(err));
  module.exports.player = player;
  const resource = voice.createAudioResource(stream, { inlineVolume: true });
  module.exports.resource = resource;
  player.play(resource);
  guildData.connection.subscribe(player);
  player.on(voice.AudioPlayerStatus.Idle, () => {
    guildData.last = guildData.songs[0];
    if (guildData.pause == false) {
      if (guildData.loop == false) guildData.songs.shift();
      playerF(interaction, guildData.songs[0]);
    }
  });
  try {
    let track = (await ytdl.getInfo(song)).videoDetails;
    if (track)
      require("../player").Events.emit("playSong", interaction, {
        title: track.title,
        author: track.author,
        url: track.video_url,
        id: track.videoId,
        duration: track.lengthSeconds,
        thumbnail: track.thumbnails[0].url,
        likes: track.likes,
        dislikes: track.dislikes,
        viewCount: track.viewCount,
        keywords: track.keywords,
      });
  } catch (err) {
    console.log(err);
  }
  player.on("error", () => {
    return;
  });
  player.on("debug", () => {
    return;
  });
  guildData.connection.on("error", () => {
    return;
  });
}
