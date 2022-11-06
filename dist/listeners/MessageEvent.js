"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageEvent = void 0;
const tslib_1 = require("tslib");
const DefineListener_1 = require("../utils/decorators/DefineListener");
const createEmbed_1 = require("../utils/createEmbed");
const BaseListener_1 = require("../structures/BaseListener");
let MessageEvent = class MessageEvent extends BaseListener_1.BaseListener {
    execute(message) {
        var _a, _b;
        if (message.author.bot)
            return message;
        if (message.channel.type === "dm")
            return message;
        if (message.content === ((_b = (_a = message.guild) === null || _a === void 0 ? void 0 : _a.me) === null || _b === void 0 ? void 0 : _b.toString())) {
            return message.channel.send(createEmbed_1.createEmbed("info", `👋  **|**  Hi there, my prefix is **\`${this.client.config.prefix}\`**`));
        }
        if (!message.content.toLowerCase().startsWith(this.client.config.prefix))
            return message;
        return this.client.commands.handle(message);
    }
};
MessageEvent = tslib_1.__decorate([
    DefineListener_1.DefineListener("message")
], MessageEvent);
exports.MessageEvent = MessageEvent;
