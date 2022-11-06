"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AboutCommand = void 0;
const tslib_1 = require("tslib");
const BaseCommand_1 = require("../structures/BaseCommand");
const discord_js_1 = require("discord.js");
const os_1 = require("os");
const path_1 = tslib_1.__importDefault(require("path"));
const formatMS_1 = require("../utils/formatMS");
const DefineCommand_1 = require("../utils/decorators/DefineCommand");
const createEmbed_1 = require("../utils/createEmbed");
let AboutCommand = class AboutCommand extends BaseCommand_1.BaseCommand {
    async execute(message) {
        var _a;
        message.channel.send(createEmbed_1.createEmbed("info", `
\`\`\`asciidoc
Users count         :: ${await this.client.getUsersCount()}
Channels count      :: ${await this.client.getChannelsCount()}
Guilds count        :: ${await this.client.getGuildsCount()}
Shards count        :: ${this.client.shard ? `${this.client.shard.count}` : "N/A"}
Shard ID            :: ${this.client.shard ? `${this.client.shard.ids[0]}` : "N/A"}
Playing music on    :: ${await this.client.getTotalPlaying()} guilds

Platform            :: ${process.platform}
Arch                :: ${process.arch}
Memory              :: ${this.bytesToSize(await this.client.getTotalMemory("rss"))}
OS uptime           :: ${formatMS_1.formatMS(os_1.uptime() * 1000)}
Process uptime      :: ${formatMS_1.formatMS(process.uptime() * 1000)}
Bot uptime          :: ${formatMS_1.formatMS(this.client.uptime)}

Node.JS version     :: ${process.version}
Discord.JS version  :: v${discord_js_1.version}
Bot version         :: v${(await Promise.resolve().then(() => tslib_1.__importStar(require(path_1.default.join(process.cwd(), "package.json"))))).version}

Source code         :: https://github.com/undrverse

\`\`\`
        `)
            .setAuthor(`${(_a = this.client.user) === null || _a === void 0 ? void 0 : _a.username} - A simple open-sourced Discord music bot`)).catch(e => this.client.logger.error("ABOUT_CMD_ERR:", e));
    }
    bytesToSize(bytes) {
        if (isNaN(bytes) && bytes !== 0)
            throw new Error(`[bytesToSize] (bytes) Error: bytes is not a Number/Integer, received: ${typeof bytes}`);
        const sizes = ["B", "KiB", "MiB", "GiB", "TiB", "PiB"];
        if (bytes < 2 && bytes > 0)
            return `${bytes} Byte`;
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString(), 10);
        if (i === 0)
            return `${bytes} ${sizes[i]}`;
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (sizes[i] === undefined)
            return `${bytes} ${sizes[sizes.length - 1]}`;
        return `${Number(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
    }
};
AboutCommand = tslib_1.__decorate([
    DefineCommand_1.DefineCommand({
        aliases: ["botinfo", "info", "stats"],
        name: "about",
        description: "Send the bot information",
        usage: "{prefix}about"
    })
], AboutCommand);
exports.AboutCommand = AboutCommand;
