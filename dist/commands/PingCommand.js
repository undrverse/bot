"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PingCommand = void 0;
const tslib_1 = require("tslib");
const BaseCommand_1 = require("../structures/BaseCommand");
const discord_js_1 = require("discord.js");
const DefineCommand_1 = require("../utils/decorators/DefineCommand");
let PingCommand = class PingCommand extends BaseCommand_1.BaseCommand {
    execute(message) {
        const before = Date.now();
        message.channel.send("*🏓 Pinging...*").then((msg) => {
            var _a;
            const latency = Date.now() - before;
            const wsLatency = this.client.ws.ping.toFixed(0);
            const embed = new discord_js_1.MessageEmbed()
                .setAuthor("🏓 PONG!", (_a = message.client.user) === null || _a === void 0 ? void 0 : _a.displayAvatarURL())
                .setColor(this.searchHex(wsLatency))
                .addFields({
                name: "API Latency",
                value: `**\`${latency}\`** ms`,
                inline: true
            }, {
                name: "WebSocket Latency",
                value: `**\`${wsLatency}\`** ms`,
                inline: true
            })
                .setFooter(`Requested by: ${message.author.tag}`, message.author.displayAvatarURL());
            msg.edit(embed);
            msg.edit("");
        }).catch(e => this.client.logger.error("PING_CMD_ERR:", e));
        return message;
    }
    searchHex(ms) {
        const listColorHex = [
            [0, 20, "#0DFF00"],
            [21, 50, "#0BC700"],
            [51, 100, "#E5ED02"],
            [101, 150, "#FF8C00"],
            [150, 200, "#FF6A00"]
        ];
        const defaultColor = "#FF0D00";
        const min = listColorHex.map(e => e[0]);
        const max = listColorHex.map(e => e[1]);
        const hex = listColorHex.map(e => e[2]);
        let ret = "#000000";
        for (let i = 0; i < listColorHex.length; i++) {
            if (min[i] <= ms && ms <= max[i]) {
                ret = hex[i];
                break;
            }
            else {
                ret = defaultColor;
            }
        }
        return ret;
    }
};
PingCommand = tslib_1.__decorate([
    DefineCommand_1.DefineCommand({
        aliases: ["pong", "pang", "pung", "peng", "pingpong"],
        name: "ping",
        description: "Shows the current ping of the bot",
        usage: "{prefix}ping"
    })
], PingCommand);
exports.PingCommand = PingCommand;
