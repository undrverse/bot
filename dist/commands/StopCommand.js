"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StopCommand = void 0;
const tslib_1 = require("tslib");
const BaseCommand_1 = require("../structures/BaseCommand");
const DefineCommand_1 = require("../utils/decorators/DefineCommand");
const MusicHelper_1 = require("../utils/decorators/MusicHelper");
const createEmbed_1 = require("../utils/createEmbed");
let StopCommand = class StopCommand extends BaseCommand_1.BaseCommand {
    execute(message) {
        var _a, _b, _c;
        (_c = (_b = (_a = message.guild) === null || _a === void 0 ? void 0 : _a.queue) === null || _b === void 0 ? void 0 : _b.voiceChannel) === null || _c === void 0 ? void 0 : _c.leave();
        message.guild.queue = null;
        message.channel.send(createEmbed_1.createEmbed("info", "⏹  **|**  The queue has been stopped."))
            .catch(e => this.client.logger.error("STOP_CMD_ERR:", e));
    }
};
tslib_1.__decorate([
    MusicHelper_1.isUserInTheVoiceChannel(),
    MusicHelper_1.isMusicPlaying(),
    MusicHelper_1.isSameVoiceChannel(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Object)
], StopCommand.prototype, "execute", null);
StopCommand = tslib_1.__decorate([
    DefineCommand_1.DefineCommand({
        aliases: ["leave", "disconnect", "dc"],
        name: "stop",
        description: "Stop track and deletes the queue",
        usage: "{prefix}stop"
    })
], StopCommand);
exports.StopCommand = StopCommand;
