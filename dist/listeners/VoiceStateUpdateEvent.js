"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoiceStateUpdateEvent = void 0;
const tslib_1 = require("tslib");
const formatMS_1 = require("../utils/formatMS");
const DefineListener_1 = require("../utils/decorators/DefineListener");
const createEmbed_1 = require("../utils/createEmbed");
const BaseListener_1 = require("../structures/BaseListener");
let VoiceStateUpdateEvent = class VoiceStateUpdateEvent extends BaseListener_1.BaseListener {
    execute(oldState, newState) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        if (newState.guild.queue) {
            const oldID = oldState.channel ? oldState.channel.id : undefined;
            const newID = newState.channel ? newState.channel.id : undefined;
            const musicVcID = (_a = newState.guild.queue.voiceChannel) === null || _a === void 0 ? void 0 : _a.id;
            // Handle when bot gets kicked from the voice channel
            if (oldState.id === ((_b = this.client.user) === null || _b === void 0 ? void 0 : _b.id) && oldID === ((_c = newState.guild.queue.voiceChannel) === null || _c === void 0 ? void 0 : _c.id) && newID === undefined) {
                try {
                    this.client.logger.info(`${this.client.shard ? `[Shard #${this.client.shard.ids[0]}]` : ""} Disconnected from a voice channel at ${newState.guild.name}, queue deleted.`);
                    (_d = newState.guild.queue.textChannel) === null || _d === void 0 ? void 0 : _d.send(createEmbed_1.createEmbed("warn", "I'm just disconnected from the voice channel, the queue will be deleted.")).catch(e => this.client.logger.error("VOICE_STATE_UPDATE_EVENT_ERR:", e));
                    return newState.guild.queue = null;
                }
                catch (e) {
                    this.client.logger.error("VOICE_STATE_UPDATE_EVENT_ERR:", e);
                }
            }
            // Handle when the bot is moved to another voice channel
            if (((_e = oldState.member) === null || _e === void 0 ? void 0 : _e.user.id) === ((_f = this.client.user) === null || _f === void 0 ? void 0 : _f.id) && oldID === musicVcID && newID !== musicVcID) {
                const vc = (_g = newState.channel) === null || _g === void 0 ? void 0 : _g.members.filter(m => !m.user.bot);
                if ((vc === null || vc === void 0 ? void 0 : vc.size) === 0 && ((_h = newState.guild.queue) === null || _h === void 0 ? void 0 : _h.timeout) === null)
                    this.doTimeout(vc, newState);
                this.resumeTimeout(vc, newState);
                newState.guild.queue.voiceChannel = newState.channel;
            }
            const vc = (_k = (_j = newState.guild.queue) === null || _j === void 0 ? void 0 : _j.voiceChannel) === null || _k === void 0 ? void 0 : _k.members.filter(m => !m.user.bot);
            // Handle when user leaves voice channel
            if (oldID === musicVcID && newID !== musicVcID && !((_l = newState.member) === null || _l === void 0 ? void 0 : _l.user.bot) && ((_m = newState.guild.queue) === null || _m === void 0 ? void 0 : _m.timeout) === null)
                this.doTimeout(vc, newState);
            // Handle when user joins voice channel or bot gets moved
            if (newID === musicVcID && !((_o = newState.member) === null || _o === void 0 ? void 0 : _o.user.bot))
                this.resumeTimeout(vc, newState);
        }
    }
    doTimeout(vc, newState) {
        var _a, _b, _c, _d, _e;
        try {
            if ((vc === null || vc === void 0 ? void 0 : vc.size) === 0) {
                clearTimeout((_a = newState.guild.queue) === null || _a === void 0 ? void 0 : _a.timeout);
                newState.guild.queue.timeout = null;
                newState.guild.queue.playing = false;
                (_c = (_b = newState.guild.queue) === null || _b === void 0 ? void 0 : _b.connection) === null || _c === void 0 ? void 0 : _c.dispatcher.pause();
                const timeout = this.client.config.deleteQueueTimeout;
                const duration = formatMS_1.formatMS(timeout);
                (_e = (_d = newState.guild.queue) === null || _d === void 0 ? void 0 : _d.textChannel) === null || _e === void 0 ? void 0 : _e.send(createEmbed_1.createEmbed("warn", "The voice channel is empty. To save resources, the queue was paused. " +
                    `If there's no one who joins my voice channel in the next **\`${duration}\`**, the queue will be deleted.`)
                    .setTitle("⏸ Queue paused")).catch(e => this.client.logger.error("VOICE_STATE_UPDATE_EVENT_ERR:", e));
                return newState.guild.queue.timeout = setTimeout(() => {
                    var _a, _b, _c, _d;
                    (_b = (_a = newState.guild.queue) === null || _a === void 0 ? void 0 : _a.connection) === null || _b === void 0 ? void 0 : _b.dispatcher.once("speaking", () => {
                        var _a, _b, _c, _d, _e;
                        (_a = newState.guild.queue) === null || _a === void 0 ? void 0 : _a.songs.clear();
                        const textChannel = this.client.channels.resolve((_c = (_b = newState.guild.queue) === null || _b === void 0 ? void 0 : _b.textChannel) === null || _c === void 0 ? void 0 : _c.id);
                        (_e = (_d = newState.guild.queue) === null || _d === void 0 ? void 0 : _d.connection) === null || _e === void 0 ? void 0 : _e.dispatcher.end(() => {
                            textChannel.send(createEmbed_1.createEmbed("error", `**\`${duration}\`** have passed and there is no one who joins my voice channel, the queue was deleted.`)
                                .setTitle("⏹ Queue deleted")).catch(e => this.client.logger.error("VOICE_STATE_UPDATE_EVENT_ERR:", e));
                        });
                    });
                    newState.guild.queue.playing = true;
                    (_d = (_c = newState.guild.queue) === null || _c === void 0 ? void 0 : _c.connection) === null || _d === void 0 ? void 0 : _d.dispatcher.resume(); // I don't know why but I think I should resume and then end the dispatcher or it won't work
                }, timeout);
            }
        }
        catch (e) {
            this.client.logger.error("VOICE_STATE_UPDATE_EVENT_ERR:", e);
        }
    }
    resumeTimeout(vc, newState) {
        var _a, _b, _c, _d, _e, _f, _g;
        if (Number(vc === null || vc === void 0 ? void 0 : vc.size) > 0) {
            if (Number(vc === null || vc === void 0 ? void 0 : vc.size) === 1) {
                clearTimeout((_a = newState.guild.queue) === null || _a === void 0 ? void 0 : _a.timeout);
                newState.guild.queue.timeout = null;
            }
            if (!((_b = newState.guild.queue) === null || _b === void 0 ? void 0 : _b.playing) && Number(vc === null || vc === void 0 ? void 0 : vc.size) < 2) {
                try {
                    const song = (_c = newState.guild.queue) === null || _c === void 0 ? void 0 : _c.songs.first();
                    (_e = (_d = newState.guild.queue) === null || _d === void 0 ? void 0 : _d.textChannel) === null || _e === void 0 ? void 0 : _e.send(createEmbed_1.createEmbed("info", `Someone joins the voice channel. Enjoy the queued music!\n🎶  **|**  Now Playing: **[${song.title}](${song.url})**`)
                        .setThumbnail(song.thumbnail)
                        .setTitle("▶ Queue resumed")).catch(e => this.client.logger.error("VOICE_STATE_UPDATE_EVENT_ERR:", e));
                    newState.guild.queue.playing = true;
                    (_g = (_f = newState.guild.queue) === null || _f === void 0 ? void 0 : _f.connection) === null || _g === void 0 ? void 0 : _g.dispatcher.resume();
                }
                catch (e) {
                    this.client.logger.error("VOICE_STATE_UPDATE_EVENT_ERR:", e);
                }
            }
        }
    }
};
VoiceStateUpdateEvent = tslib_1.__decorate([
    DefineListener_1.DefineListener("voiceStateUpdate")
], VoiceStateUpdateEvent);
exports.VoiceStateUpdateEvent = VoiceStateUpdateEvent;
