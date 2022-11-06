"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidVoiceChannel = exports.isUserInTheVoiceChannel = exports.isSameVoiceChannel = exports.isMusicPlaying = exports.inhibit = void 0;
const createEmbed_1 = require("../createEmbed");
function inhibit(func) {
    return function decorate(target, key, descriptor) {
        const original = descriptor.value;
        descriptor.value = async function (message, args) {
            const result = await func(message, args);
            if (result === undefined)
                return original.apply(this, [message, args]);
            return null;
        };
        return descriptor;
    };
}
exports.inhibit = inhibit;
function isMusicPlaying() {
    return inhibit(message => {
        var _a;
        if (((_a = message.guild) === null || _a === void 0 ? void 0 : _a.queue) === null)
            return message.channel.send(createEmbed_1.createEmbed("warn", "There is nothing playing."));
    });
}
exports.isMusicPlaying = isMusicPlaying;
function isSameVoiceChannel() {
    return inhibit(message => {
        var _a, _b, _c, _d, _e, _f;
        if (!((_b = (_a = message.guild) === null || _a === void 0 ? void 0 : _a.me) === null || _b === void 0 ? void 0 : _b.voice.channel))
            return undefined;
        if (((_d = (_c = message.member) === null || _c === void 0 ? void 0 : _c.voice.channel) === null || _d === void 0 ? void 0 : _d.id) !== ((_f = (_e = message.guild.queue) === null || _e === void 0 ? void 0 : _e.voiceChannel) === null || _f === void 0 ? void 0 : _f.id)) {
            return message.channel.send(createEmbed_1.createEmbed("warn", "You need to be in a same voice channel as mine"));
        }
    });
}
exports.isSameVoiceChannel = isSameVoiceChannel;
function isUserInTheVoiceChannel() {
    return inhibit(message => {
        var _a;
        if (!((_a = message.member) === null || _a === void 0 ? void 0 : _a.voice.channel)) {
            return message.channel.send(createEmbed_1.createEmbed("warn", "I'm sorry, but you need to be in a voice channel to do that"));
        }
    });
}
exports.isUserInTheVoiceChannel = isUserInTheVoiceChannel;
function isValidVoiceChannel() {
    return inhibit(message => {
        var _a;
        const voiceChannel = (_a = message.member) === null || _a === void 0 ? void 0 : _a.voice.channel;
        if (!(voiceChannel === null || voiceChannel === void 0 ? void 0 : voiceChannel.joinable)) {
            return message.channel.send(createEmbed_1.createEmbed("error", "I'm sorry, but I can't connect to your voice channel, make sure I have a proper permissions!"));
        }
        if (!voiceChannel.speakable) {
            voiceChannel.leave();
            return message.channel.send(createEmbed_1.createEmbed("error", "I'm sorry, but I can't speak in this voice channel, make sure I have a proper permissions!"));
        }
    });
}
exports.isValidVoiceChannel = isValidVoiceChannel;
