"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerQueue = void 0;
/* eslint-disable no-underscore-dangle, @typescript-eslint/unbound-method */
const SongManager_1 = require("../utils/SongManager");
class ServerQueue {
    constructor(textChannel = null, voiceChannel = null) {
        this.textChannel = textChannel;
        this.voiceChannel = voiceChannel;
        this.connection = null;
        this.songs = new SongManager_1.SongManager();
        this.volume = 0;
        this.playing = false;
        this.loopMode = 0;
        this.timeout = null;
        this.volume = textChannel.client.config.defaultVolume;
    }
}
exports.ServerQueue = ServerQueue;
