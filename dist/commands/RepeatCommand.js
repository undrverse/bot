"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepeatCommand = void 0;
const tslib_1 = require("tslib");
const BaseCommand_1 = require("../structures/BaseCommand");
const DefineCommand_1 = require("../utils/decorators/DefineCommand");
const MusicHelper_1 = require("../utils/decorators/MusicHelper");
const createEmbed_1 = require("../utils/createEmbed");
let RepeatCommand = class RepeatCommand extends BaseCommand_1.BaseCommand {
    execute(message, args) {
        const mode = args[0];
        if (mode === "all" || mode === "queue" || mode === "*" || mode === "2") {
            message.guild.queue.loopMode = 2;
            return message.channel.send(createEmbed_1.createEmbed("info", "🔁  **|**  Repeating all music in the queue"));
        }
        else if (mode === "current" || mode === "one" || mode === "musiconly" || mode === "1") {
            message.guild.queue.loopMode = 1;
            return message.channel.send(createEmbed_1.createEmbed("info", "🔂  **|**  Repeating this music only"));
        }
        else if (mode === "disable" || mode === "off" || mode === "0") {
            message.guild.queue.loopMode = 0;
            return message.channel.send(createEmbed_1.createEmbed("info", "▶  **|**  Repeating disabled"));
        }
        message.channel.send(`Invalid value, see **\`${this.client.config.prefix}help ${this.meta.name}\`** for more information!`).catch(e => this.client.logger.error("REPEAT_CMD_ERR:", e));
    }
};
tslib_1.__decorate([
    MusicHelper_1.isUserInTheVoiceChannel(),
    MusicHelper_1.isMusicPlaying(),
    MusicHelper_1.isSameVoiceChannel(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Array]),
    tslib_1.__metadata("design:returntype", Object)
], RepeatCommand.prototype, "execute", null);
RepeatCommand = tslib_1.__decorate([
    DefineCommand_1.DefineCommand({
        aliases: ["loop", "music-repeat", "music-loop"],
        name: "repeat",
        description: "Repeat the current track or queue",
        usage: "{prefix}repeat <all | one | disable>"
    })
], RepeatCommand);
exports.RepeatCommand = RepeatCommand;
