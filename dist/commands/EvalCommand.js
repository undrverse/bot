"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvalCommand = void 0;
const tslib_1 = require("tslib");
/* eslint-disable no-eval */
const BaseCommand_1 = require("../structures/BaseCommand");
const discord_js_1 = require("discord.js");
const https_1 = require("https");
const util_1 = require("util");
const DefineCommand_1 = require("../utils/decorators/DefineCommand");
const createEmbed_1 = require("../utils/createEmbed");
let EvalCommand = class EvalCommand extends BaseCommand_1.BaseCommand {
    async execute(message, args) {
        const msg = message;
        const client = this.client;
        if (!client.config.owners.includes(msg.author.id)) {
            return message.channel.send(createEmbed_1.createEmbed("error", "Only the bot owner can use this command."));
        }
        const embed = new discord_js_1.MessageEmbed()
            .setColor(this.client.config.embedColor)
            .addField("**Input**", `\`\`\`js\n${args.join(" ")}\`\`\``);
        try {
            const code = args.slice(0).join(" ");
            if (!code)
                return message.channel.send("No valid argument was provided");
            let evaled = await eval(code);
            if (typeof evaled !== "string") {
                evaled = util_1.inspect(evaled, {
                    depth: 0
                });
            }
            const output = this.clean(evaled);
            if (output.length > 1024) {
                const hastebin = await this.hastebin(output);
                embed.addField("**Output**", `${hastebin}.js`);
            }
            else {
                embed.addField("**Output**", `\`\`\`js\n${output}\`\`\``);
            }
            void message.channel.send(embed);
        }
        catch (e) {
            const error = this.clean(e);
            if (error.length > 1024) {
                const hastebin = await this.hastebin(error);
                embed.addField("**Error**", `${hastebin}.js`);
            }
            else {
                embed.setColor("RED").addField("**Error**", `\`\`\`js\n${error}\`\`\``);
            }
            message.channel.send(embed).catch(e => this.client.logger.error("EVAL_CMD_MSG_ERR:", e));
            this.client.logger.error("EVAL_CMD_ERR:", e);
        }
        return message;
    }
    clean(text) {
        if (typeof text === "string") {
            return text
                .replace(new RegExp(process.env.DISCORD_TOKEN, "g"), "[REDACTED]")
                .replace(new RegExp(process.env.YT_API_KEY, "g"), "[REDACTED]")
                .replace(/`/g, `\`${String.fromCharCode(8203)}`)
                .replace(/@/g, `@${String.fromCharCode(8203)}`);
        }
        return text;
    }
    hastebin(text) {
        return new Promise((resolve, reject) => {
            const req = https_1.request({ hostname: "bin.zhycorp.xyz", path: "/documents", method: "POST", minVersion: "TLSv1.3" }, res => {
                let raw = "";
                res.on("data", chunk => raw += chunk);
                res.on("end", () => {
                    if (res.statusCode >= 200 && res.statusCode < 300)
                        return resolve(`https://bin.zhycorp.xyz/${JSON.parse(raw).key}`);
                    return reject(new Error(`[hastebin] Error while trying to send data to https://bin.zhycorp.xyz/documents, ${res.statusCode} ${res.statusMessage}`));
                });
            }).on("error", reject);
            req.write(typeof text === "object" ? JSON.stringify(text, null, 2) : text);
            req.end();
        });
    }
};
EvalCommand = tslib_1.__decorate([
    DefineCommand_1.DefineCommand({
        aliases: ["ev", "js-exec", "e", "evaluate"],
        cooldown: 0,
        description: "Only the bot owner can use this command",
        name: "eval",
        usage: "{prefix}eval <some js code>"
    })
], EvalCommand);
exports.EvalCommand = EvalCommand;
