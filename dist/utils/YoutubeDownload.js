"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playSong = void 0;
const ytdl_core_1 = require("ytdl-core");
const stream_1 = require("stream");
const path_1 = require("path");
const fs_1 = require("fs");
// Inspired by ytdl-core-discord (https://github.com/amishshah/ytdl-core-discord)  // 1048576 * 1 = 1MB
function playSong(youtubeLink, options = { filter: "audio", quality: "highestaudio", highWaterMark: 1048576 * 32 }) {
    return new Promise((resolve, reject) => {
        ytdl_core_1.getInfo(youtubeLink).then(info => {
            const canDemux = info.formats.find(filter) !== undefined && Number(info.videoDetails.lengthSeconds) !== 0;
            options = canDemux ? { ...options, filter } : { ...options };
            if (options.cache && info.formats.find(f => !f.isLive) && !(Number(info.videoDetails.lengthSeconds) >= options.cacheMaxLength)) {
                const path = path_1.resolve(process.cwd(), "cache");
                const filePath = path_1.resolve(path, `${info.videoDetails.videoId}.webm`);
                const finishMarkerPath = `${filePath}.jukeboxCacheFinish.marker`;
                if (fs_1.existsSync(path_1.resolve(filePath))) {
                    if (fs_1.existsSync(path_1.resolve(finishMarkerPath)))
                        return resolve({ canDemux, info, stream: fs_1.createReadStream(filePath), cache: true });
                    return cache(info, options, canDemux, filePath, finishMarkerPath, resolve);
                }
                return cache(info, options, canDemux, filePath, finishMarkerPath, resolve);
            }
            return resolve({ canDemux, info, stream: ytdl_core_1.downloadFromInfo(info, options), cache: false });
        }).catch(reject);
    });
}
exports.playSong = playSong;
function filter(f) {
    return f.codecs === "opus" && f.container === "webm" && Number(f.audioSampleRate) === 48000;
}
function cache(info, options, canDemux, path, finishMarkerPath, resolve) {
    const data = ytdl_core_1.downloadFromInfo(info, options);
    const stream = new stream_1.PassThrough();
    const cache = fs_1.createWriteStream(path)
        .on("close", () => fs_1.appendFileSync(finishMarkerPath, ""));
    data.on("data", chunk => { stream.write(chunk); cache.write(chunk); });
    data.on("end", () => { stream.end(); cache.end(); });
    return resolve({ canDemux, info, stream, cache: false });
}
