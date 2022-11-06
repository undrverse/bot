"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Disc_11 = void 0;
const tslib_1 = require("tslib");
/* eslint-disable no-underscore-dangle, @typescript-eslint/unbound-method, @typescript-eslint/restrict-plus-operands, @typescript-eslint/naming-convention */
const discord_js_1 = require("discord.js");
const path_1 = require("path");
const config = tslib_1.__importStar(require("../config"));
const Logger_1 = require("../utils/Logger");
const CommandsManager_1 = require("../utils/CommandsManager");
const ListenerLoader_1 = require("../utils/ListenerLoader");
const YoutubeAPI_1 = require("../utils/YoutubeAPI");
// Extends DiscordJS Structures
require("./Guild");
class Disc_11 extends discord_js_1.Client {
    constructor(opt) {
        super(opt);
        this.config = config;
        this.logger = Logger_1.createLogger(config.name, config.debug);
        this.youtube = new YoutubeAPI_1.YoutubeAPI(process.env.YT_API_KEY);
        this.commands = new CommandsManager_1.CommandsManager(this, path_1.resolve(__dirname, "..", "commands"));
        this.listenerLoader = new ListenerLoader_1.ListenerLoader(this, path_1.resolve(__dirname, "..", "listeners"));
    }
    async build(token) {
        this.on("ready", () => this.commands.load());
        this.listenerLoader.load().catch(e => this.logger.error("LISTENER_LOADER_ERR:", e));
        await this.login(token);
        return this;
    }
    async getGuildsCount() {
        if (!this.shard)
            return this.guilds.cache.size;
        const size = await this.shard.broadcastEval("this.guilds.cache.size");
        return size.reduce((p, v) => p + v, 0);
    }
    async getChannelsCount(filter = true) {
        if (filter) {
            if (!this.shard)
                return this.channels.cache.filter(c => c.type !== "category" && c.type !== "dm").size;
            const size = await this.shard.broadcastEval("this.channels.cache.filter(c => c.type !== 'category' && c.type !== 'dm').size");
            return size.reduce((p, v) => p + v, 0);
        }
        if (!this.shard)
            return this.channels.cache.size;
        const size = await this.shard.broadcastEval("this.channels.cache.size");
        return size.reduce((p, v) => p + v, 0);
    }
    async getUsersCount(filter = true) {
        const temp = new discord_js_1.Collection();
        if (filter) {
            if (!this.shard)
                return this.users.cache.filter(u => !u.equals(this.user)).size;
            const shards = await this.shard.broadcastEval("this.users.cache.filter(u => !u.equals(this.user))");
            for (const shard of shards) {
                for (const user of shard) {
                    temp.set(user.id, user);
                }
            }
            return temp.size;
        }
        if (!this.shard)
            return this.users.cache.size;
        const shards = await this.shard.broadcastEval("this.users.cache");
        for (const shard of shards) {
            for (const user of shard) {
                temp.set(user.id, user);
            }
        }
        return temp.size;
    }
    async getTotalPlaying() {
        if (!this.shard)
            return this.guilds.cache.filter((g) => g.queue !== null && g.queue.playing === true).size;
        return this.shard.broadcastEval("this.guilds.cache.filter(g => g.queue !== null && g.queue.playing === true).size").then(data => data.reduce((a, b) => a + b));
    }
    async getTotalMemory(type) {
        if (!this.shard)
            return process.memoryUsage()[type];
        return this.shard.broadcastEval(`process.memoryUsage()["${type}"]`).then(data => data.reduce((a, b) => a + b));
    }
}
exports.Disc_11 = Disc_11;
