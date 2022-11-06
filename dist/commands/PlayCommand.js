"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayCommand = void 0;
const tslib_1 = require("tslib");
/* eslint-disable block-scoped-var, @typescript-eslint/restrict-template-expressions */
const BaseCommand_1 = require("../structures/BaseCommand");
const ServerQueue_1 = require("../structures/ServerQueue");
const YoutubeDownload_1 = require("../utils/YoutubeDownload");
const discord_js_1 = require("discord.js");
const entities_1 = require("entities");
const DefineCommand_1 = require("../utils/decorators/DefineCommand");
const MusicHelper_1 = require("../utils/decorators/MusicHelper");
const createEmbed_1 = require("../utils/createEmbed");
let PlayCommand = class PlayCommand extends BaseCommand_1.BaseCommand {
    async execute(message, args) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        const voiceChannel = message.member.voice.channel;
        if (!args[0]) {
            return message.channel.send(createEmbed_1.createEmbed("warn", `Invalid arguments, type **\`${this.client.config.prefix}help play\`** for more information`));
        }
        const searchString = args.join(" ");
        const url = searchString.replace(/<(.+)>/g, "$1");
        if (((_a = message.guild) === null || _a === void 0 ? void 0 : _a.queue) !== null && voiceChannel.id !== ((_c = (_b = message.guild) === null || _b === void 0 ? void 0 : _b.queue.voiceChannel) === null || _c === void 0 ? void 0 : _c.id)) {
            return message.channel.send(createEmbed_1.createEmbed("warn", `Music on this server is already playing on: **\`${(_e = (_d = message.guild) === null || _d === void 0 ? void 0 : _d.queue.voiceChannel) === null || _e === void 0 ? void 0 : _e.name}\`** voice channel`));
        }
        if (/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/.exec(url)) {
            try {
                const playlist = await this.client.youtube.getPlaylistByURL(url);
                const videos = await playlist.getVideos();
                let skippedVideos = 0;
                message.channel.send(createEmbed_1.createEmbed("info", `Adding all videos in playlist: **[${playlist.title}](${playlist.url})**, hang on...`))
                    .catch(e => this.client.logger.error("PLAY_CMD_ERR:", e));
                for (const video of Object.values(videos)) {
                    if (video.status.privacyStatus === "private") {
                        skippedVideos++;
                        continue;
                    }
                    else {
                        const video2 = await this.client.youtube.getVideo(video.id);
                        await this.handleVideo(video2, message, voiceChannel, true);
                    }
                }
                if (skippedVideos !== 0) {
                    message.channel.send(createEmbed_1.createEmbed("warn", `${skippedVideos} ${skippedVideos >= 2 ? `videos` : `video`} are skipped because it's a private video`)).catch(e => this.client.logger.error("PLAY_CMD_ERR:", e));
                }
                if (skippedVideos === playlist.itemCount)
                    return message.channel.send(createEmbed_1.createEmbed("error", `Failed to load **[${playlist.title}](${playlist.url})** playlist because all of items are private video.`));
                return message.channel.send(createEmbed_1.createEmbed("info", `✅  **|**  All videos in **[${playlist.title}](${playlist.url})**, has been added to the queue!`));
            }
            catch (e) {
                if (e.response.body.error.message === 'The request cannot be completed because you have exceeded your <a href="/youtube/v3/getting-started#quota">quota</a>.') {
                    this.client.logger.error("YT_PLAYLIST_ERR:", new Error("YouTube Data API v3 quota exceeded"));
                    return message.channel.send(createEmbed_1.createEmbed("error", `Error: \`YouTube Data API v3 quota exceeded\`, please contact the bot owner.`));
                }
                this.client.logger.error("YT_PLAYLIST_ERR:", e);
                return message.channel.send(createEmbed_1.createEmbed("error", `I can't load the playlist.\nError: \`${e.message}\``));
            }
        }
        try {
            // eslint-disable-next-line no-var, block-scoped-var
            var video = await this.client.youtube.getVideoByURL(url);
        }
        catch (e) {
            try {
                const videos = await this.client.youtube.searchVideos(searchString, this.client.config.searchMaxResults);
                if (videos.length === 0)
                    return message.channel.send(createEmbed_1.createEmbed("error", "I could not obtain any search results."));
                if (this.client.config.disableSongSelection) {
                    video = await this.client.youtube.getVideo(videos[0].id);
                }
                else {
                    let index = 0;
                    const msg = await message.channel.send(new discord_js_1.MessageEmbed()
                        .setAuthor("Song Selection")
                        .setDescription(`\`\`\`\n${videos.map(video => `${++index} - ${this.cleanTitle(video.title)}`).join("\n")}\`\`\`\n` +
                        `Please provide a value to select one of the search results ranging from **\`1-${this.client.config.searchMaxResults}\`**!`)
                        .setThumbnail((_f = message.client.user) === null || _f === void 0 ? void 0 : _f.displayAvatarURL())
                        .setColor(this.client.config.embedColor)
                        .setFooter("• Type cancel or c to cancel the song selection"));
                    try {
                        // eslint-disable-next-line no-var
                        var response = await message.channel.awaitMessages((msg2) => {
                            if (message.author.id !== msg2.author.id)
                                return false;
                            if (msg2.content === "cancel" || msg2.content === "c")
                                return true;
                            return Number(msg2.content) > 0 && Number(msg2.content) < 13;
                        }, {
                            max: 1,
                            time: this.client.config.selectTimeout,
                            errors: ["time"]
                        });
                        msg.delete().catch(e => this.client.logger.error("PLAY_CMD_ERR:", e));
                        (_g = response.first()) === null || _g === void 0 ? void 0 : _g.delete({ timeout: 3000 }).catch(e => e); // do nothing
                    }
                    catch (error) {
                        msg.delete().catch(e => this.client.logger.error("PLAY_CMD_ERR:", e));
                        return message.channel.send(createEmbed_1.createEmbed("error", "No or invalid value entered, the song selection has been canceled."));
                    }
                    if (((_h = response.first()) === null || _h === void 0 ? void 0 : _h.content) === "c" || ((_j = response.first()) === null || _j === void 0 ? void 0 : _j.content) === "cancel") {
                        return message.channel.send(createEmbed_1.createEmbed("warn", "The song selection has been canceled."));
                    }
                    const videoIndex = parseInt((_k = response.first()) === null || _k === void 0 ? void 0 : _k.content, 10);
                    video = await this.client.youtube.getVideo(videos[videoIndex - 1].id);
                }
            }
            catch (err) {
                if (e.response.body.error.message === 'The request cannot be completed because you have exceeded your <a href="/youtube/v3/getting-started#quota">quota</a>.') {
                    this.client.logger.error("YT_SEARCH_ERR:", new Error("YouTube Data API v3 quota exceeded"));
                    return message.channel.send(createEmbed_1.createEmbed("error", `Error: \`YouTube Data API v3 quota exceeded\`, please contact the bot owner.`));
                }
                this.client.logger.error("YT_SEARCH_ERR:", err);
                return message.channel.send(createEmbed_1.createEmbed("error", `I could not obtain any search results.\nError: \`${err.message}\``));
            }
        }
        return this.handleVideo(video, message, voiceChannel);
    }
    async handleVideo(video, message, voiceChannel, playlist = false) {
        var _a, _b, _c, _d, _e;
        const song = {
            id: video.id,
            title: this.cleanTitle(video.title),
            url: video.url,
            thumbnail: video.thumbnailURL
        };
        if ((_a = message.guild) === null || _a === void 0 ? void 0 : _a.queue) {
            if (!this.client.config.allowDuplicate && message.guild.queue.songs.find(s => s.id === song.id)) {
                return message.channel.send(createEmbed_1.createEmbed("warn", `Song: **[${song.title}](${song.id})** is already queued, and this bot configuration disallow duplicated song in queue, ` +
                    `please use \`${this.client.config.prefix}repeat\` instead`)
                    .setTitle("⌛ Already queued"));
            }
            message.guild.queue.songs.addSong(song);
            if (playlist)
                return;
            message.channel.send(createEmbed_1.createEmbed("info", `✅  **|**  **[${song.title}](${song.url})** has been added to the queue!`).setThumbnail(song.thumbnail))
                .catch(e => this.client.logger.error("PLAY_CMD_ERR:", e));
        }
        else {
            message.guild.queue = new ServerQueue_1.ServerQueue(message.channel, voiceChannel);
            (_b = message.guild) === null || _b === void 0 ? void 0 : _b.queue.songs.addSong(song);
            try {
                const connection = await ((_d = (_c = message.guild) === null || _c === void 0 ? void 0 : _c.queue.voiceChannel) === null || _d === void 0 ? void 0 : _d.join());
                message.guild.queue.connection = connection;
            }
            catch (error) {
                (_e = message.guild) === null || _e === void 0 ? void 0 : _e.queue.songs.clear();
                message.guild.queue = null;
                this.client.logger.error("PLAY_CMD_ERR:", error);
                message.channel.send(createEmbed_1.createEmbed("error", `Error: Could not join the voice channel, because:\n\`${error}\``))
                    .catch(e => this.client.logger.error("PLAY_CMD_ERR:", e));
                return undefined;
            }
            this.play(message.guild).catch(err => {
                message.channel.send(createEmbed_1.createEmbed("error", `Error while trying to play music:\n\`${err}\``))
                    .catch(e => this.client.logger.error("PLAY_CMD_ERR:", e));
                return this.client.logger.error("PLAY_CMD_ERR:", err);
            });
        }
        return message;
    }
    async play(guild) {
        var _a, _b, _c, _d, _e;
        const serverQueue = guild.queue;
        const song = serverQueue.songs.first();
        if (!song) {
            (_a = serverQueue.textChannel) === null || _a === void 0 ? void 0 : _a.send(createEmbed_1.createEmbed("info", `⏹  **|**  Queue has finished, use **\`${guild.client.config.prefix}play\`** again to play more songs!`)).catch(e => this.client.logger.error("PLAY_ERR:", e));
            (_b = serverQueue.connection) === null || _b === void 0 ? void 0 : _b.disconnect();
            return guild.queue = null;
        }
        (_d = (_c = serverQueue.connection) === null || _c === void 0 ? void 0 : _c.voice) === null || _d === void 0 ? void 0 : _d.setSelfDeaf(true).catch(e => this.client.logger.error("PLAY_ERR:", e));
        const songData = await YoutubeDownload_1.playSong(song.url, { cache: this.client.config.cacheYoutubeDownloads, cacheMaxLength: this.client.config.cacheMaxLengthAllowed });
        if (songData.cache)
            this.client.logger.info(`${this.client.shard ? `[Shard #${this.client.shard.ids}]` : ""} Using cache for song "${song.title}" on ${guild.name}`);
        (_e = serverQueue.connection) === null || _e === void 0 ? void 0 : _e.play(songData.stream, { type: songData.canDemux ? "webm/opus" : "unknown", bitrate: "auto", highWaterMark: 1 }).on("start", () => {
            var _a;
            serverQueue.playing = true;
            this.client.logger.info(`${this.client.shard ? `[Shard #${this.client.shard.ids}]` : ""} Song: "${song.title}" on ${guild.name} has started`);
            (_a = serverQueue.textChannel) === null || _a === void 0 ? void 0 : _a.send(createEmbed_1.createEmbed("info", `▶  **|**  Start playing: **[${song.title}](${song.url})**`).setThumbnail(song.thumbnail)).catch(e => this.client.logger.error("PLAY_ERR:", e));
        }).on("finish", () => {
            this.client.logger.info(`${this.client.shard ? `[Shard #${this.client.shard.ids}]` : ""} Song: "${song.title}" on ${guild.name} has ended`);
            // eslint-disable-next-line max-statements-per-line
            if (serverQueue.loopMode === 0) {
                serverQueue.songs.deleteFirst();
            }
            else if (serverQueue.loopMode === 2) {
                serverQueue.songs.deleteFirst();
                serverQueue.songs.addSong(song);
            }
            /* serverQueue.textChannel?.send(createEmbed("info", `⏹  **|**  Stop playing: **[${song.title}](${song.url})**`).setThumbnail(song.thumbnail))
                .catch(e => this.client.logger.error("PLAY_ERR:", e)); */
            this.play(guild).catch(e => {
                var _a, _b;
                (_a = serverQueue.textChannel) === null || _a === void 0 ? void 0 : _a.send(createEmbed_1.createEmbed("error", `Error while trying to play music:\n\`${e}\``)).catch(e => this.client.logger.error("PLAY_ERR:", e));
                (_b = serverQueue.connection) === null || _b === void 0 ? void 0 : _b.dispatcher.end();
                return this.client.logger.error("PLAY_ERR:", e);
            });
        }).on("error", (err) => {
            this.client.logger.error("PLAY_ERR:", err);
        }).setVolume(serverQueue.volume / guild.client.config.maxVolume);
    }
    cleanTitle(title) {
        return discord_js_1.Util.escapeMarkdown(entities_1.decodeHTML(title));
    }
};
tslib_1.__decorate([
    MusicHelper_1.isUserInTheVoiceChannel(),
    MusicHelper_1.isValidVoiceChannel(),
    MusicHelper_1.isSameVoiceChannel(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Array]),
    tslib_1.__metadata("design:returntype", Promise)
], PlayCommand.prototype, "execute", null);
PlayCommand = tslib_1.__decorate([
    DefineCommand_1.DefineCommand({
        aliases: ["p", "add", "play-music"],
        name: "play",
        description: "Play some music",
        usage: "{prefix}play <youtube video or youtube video name or playlist link>"
    })
], PlayCommand);
exports.PlayCommand = PlayCommand;
