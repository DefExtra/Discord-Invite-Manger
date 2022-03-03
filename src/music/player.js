const { Client, Interaction, Message } = require("discord.js");
const { play } = require("./functions/play");
const { generateDependencyReport } = require('@discordjs/voice');
const EventEmitter = require("node:events");
const chalkAnimation = require("chalk-animation");
const emiiter = new EventEmitter();
EventEmitter.defaultMaxListeners = 20;

module.exports.Events = emiiter;
module.exports.Player = class Player {
    /**
     * 
     * @param {Client} client 
     */
    constructor () {
        this.events = emiiter;
        const rainbow = chalkAnimation.rainbow(generateDependencyReport());
        rainbow.start()
    }
    /**
     * 
     * @param {Interaction | Message} interaction
     * @param {string} song
     */
    play(interaction, song) {
        try {
        play(interaction, song);
        } catch (err) {
            console.log(err);
        }
    }
}