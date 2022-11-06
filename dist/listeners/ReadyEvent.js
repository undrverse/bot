"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadyEvent = void 0;
const tslib_1 = require("tslib");
const BaseListener_1 = require("../structures/BaseListener");
const DefineListener_1 = require("../utils/decorators/DefineListener");
let ReadyEvent = class ReadyEvent extends BaseListener_1.BaseListener {
    execute() {
        this.client.logger.info(`${this.client.shard ? `[Shard #${this.client.shard.ids[0]}]` : ""} ${this.client.user.tag} is ready to serve ${this.client.guilds.cache.size} guilds!`);
        const updatePresence = async () => {
            var _a;
            const activityName = this.client.config.status.activity
                .replace(/{guildsCount}/g, (await this.client.getGuildsCount()).toString())
                .replace(/{playingCount}/g, (await this.client.getTotalPlaying()).toString())
                .replace(/{usersCount}/g, (await this.client.getUsersCount()).toString())
                .replace(/{botPrefix}/g, this.client.config.prefix);
            (_a = this.client.user) === null || _a === void 0 ? void 0 : _a.setPresence({
                activity: { name: activityName, type: this.client.config.status.type }
            }).catch(e => this.client.logger.error("CLIENT_UPDATE_PRESENCE_ERR:", e));
        };
        setInterval(updatePresence, 30 * 1000);
        void updatePresence();
    }
};
ReadyEvent = tslib_1.__decorate([
    DefineListener_1.DefineListener("ready")
], ReadyEvent);
exports.ReadyEvent = ReadyEvent;
