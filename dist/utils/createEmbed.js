"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEmbed = void 0;
const discord_js_1 = require("discord.js");
const config_1 = require("../config");
const hexColors = {
    info: config_1.embedColor,
    warn: "#FFFF00",
    error: "#FF0000"
};
function createEmbed(type, message) {
    const embed = new discord_js_1.MessageEmbed()
        .setColor(hexColors[type]);
    if (message)
        embed.setDescription(message);
    return embed;
}
exports.createEmbed = createEmbed;
