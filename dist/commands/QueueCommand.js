"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueCommand = void 0;
const tslib_1 = require("tslib");
const BaseCommand_1 = require("../structures/BaseCommand");
const DefineCommand_1 = require("../utils/decorators/DefineCommand");
const MusicHelper_1 = require("../utils/decorators/MusicHelper");
const createEmbed_1 = require("../utils/createEmbed");
let QueueCommand = class QueueCommand extends BaseCommand_1.BaseCommand {
    execute(message) {
        var _a, _b, _c, _d;
        const embed = createEmbed_1.createEmbed("info")
            .setTitle("**Song Queue**");
        let num = 1;
        const songs = (_b = (_a = message.guild) === null || _a === void 0 ? void 0 : _a.queue) === null || _b === void 0 ? void 0 : _b.songs.map(s => `**${num++}.** **[${s.title}](${s.url})**`);
        if (Number((_d = (_c = message.guild) === null || _c === void 0 ? void 0 : _c.queue) === null || _d === void 0 ? void 0 : _d.songs.size) > 10) {
            const indexes = this.chunk(songs, 10);
            let index = 0;
            embed.setDescription(`\`\`\`\n${indexes[index]}\`\`\``).setFooter(`• Page ${index + 1} of ${indexes.length}`, "https://hzmi.xyz/assets/images/390511462361202688.png");
            message.channel.send(embed).then(msg => {
                msg.react("◀️").then(() => {
                    msg.react("▶️").catch(e => this.client.logger.error("QUEUE_CMD_ERR:", e));
                    msg.createReactionCollector((reaction, user) => reaction.emoji.name === "◀️" && user.id === message.author.id, { time: 80 * 1000 }).on("collect", () => {
                        if (index === 0)
                            return undefined;
                        index--;
                        embed.setDescription(indexes[index]).setFooter(`Page ${index + 1} of ${indexes.length}`, "https://hzmi.xyz/assets/images/390511462361202688.png");
                        msg.edit(embed).catch(e => this.client.logger.error("QUEUE_CMD_ERR:", e));
                    });
                    msg.createReactionCollector((reaction, user) => reaction.emoji.name === "▶️" && user.id === message.author.id, { time: 80 * 1000 }).on("collect", () => {
                        if (index + 1 === indexes.length)
                            return undefined;
                        index++;
                        embed.setDescription(indexes[index]).setFooter(`Page ${index + 1} of ${indexes.length}`, "https://hzmi.xyz/assets/images/390511462361202688.png");
                        msg.edit(embed).catch(e => this.client.logger.error("QUEUE_CMD_ERR:", e));
                    });
                }).catch(e => this.client.logger.error("QUEUE_CMD_ERR:", e));
            }).catch(e => this.client.logger.error("QUEUE_CMD_ERR:", e));
        }
        else {
            message.channel.send(embed.setDescription(songs.join("\n"))).catch(e => this.client.logger.error("QUEUE_CMD_ERR:", e));
        }
    }
    chunk(array, chunkSize) {
        const temp = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            temp.push(array.slice(i, i + chunkSize));
        }
        return temp;
    }
};
tslib_1.__decorate([
    MusicHelper_1.isMusicPlaying(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Object)
], QueueCommand.prototype, "execute", null);
QueueCommand = tslib_1.__decorate([
    DefineCommand_1.DefineCommand({
        aliases: ["q", "queue-list", "track-list"],
        name: "queue",
        description: "Show the current track queue",
        usage: "{prefix}queue"
    })
], QueueCommand);
exports.QueueCommand = QueueCommand;
