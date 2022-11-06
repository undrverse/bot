"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const config_1 = require("./config");
const Disc_11_1 = require("./structures/Disc_11");
const intents = ["GUILDS", "GUILD_VOICE_STATES", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS"];
const client = new Disc_11_1.Disc_11({
    disableMentions: "everyone",
    fetchAllMembers: config_1.fetchAllUsers,
    messageCacheLifetime: 60,
    messageCacheMaxSize: Infinity,
    messageEditHistoryMaxSize: Infinity,
    messageSweepInterval: 180,
    ws: {
        intents: config_1.fetchAllUsers ? intents.concat(["GUILD_MEMBERS"]) : intents
    }
});
process.on("unhandledRejection", e => {
    client.logger.error("UNHANDLED_REJECTION: ", e);
});
process.on("uncaughtException", e => {
    client.logger.error("UNCAUGHT_EXCEPTION: ", e);
    client.logger.warn("Uncaught Exception detected. Restarting...");
    process.exit(1);
});
client.build(process.env.DISCORD_TOKEN)
    .catch(e => client.logger.error("CLIENT_BUILD_ERR: ", e));
