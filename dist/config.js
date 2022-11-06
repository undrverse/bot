"use strict";
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchAllUsers = exports.status = exports.debug = exports.disableInviteCmd = exports.cacheMaxLengthAllowed = exports.cacheYoutubeDownloads = exports.deleteQueueTimeout = exports.selectTimeout = exports.searchMaxResults = exports.disableSongSelection = exports.allowDuplicate = exports.maxVolume = exports.defaultVolume = exports.totalShards = exports.owners = exports.embedColor = exports.prefix = exports.name = void 0;
exports.name = (_a = process.env.CONFIG_NAME) !== null && _a !== void 0 ? _a : "Disc 11";
exports.prefix = (_c = (_b = process.env.CONFIG_PREFIX) === null || _b === void 0 ? void 0 : _b.replace(/"/g, "")) !== null && _c !== void 0 ? _c : "!"; // Temporary workaround for https://github.com/docker/compose/issues/6951
exports.embedColor = (_d = process.env.CONFIG_EMBED_COLOR) !== null && _d !== void 0 ? _d : "7289DA";
exports.owners = (_f = (_e = process.env.CONFIG_OWNERS) === null || _e === void 0 ? void 0 : _e.replace(/  +/g, " ").split(/,[ ]?/)) !== null && _f !== void 0 ? _f : [];
exports.totalShards = (_g = process.env.CONFIG_TOTALSHARDS) !== null && _g !== void 0 ? _g : "auto";
exports.defaultVolume = Number(process.env.CONFIG_DEFAULT_VOLUME) || 50;
exports.maxVolume = Number(process.env.CONFIG_MAX_VOLUME) || 100;
exports.allowDuplicate = process.env.CONFIG_ALLOW_DUPLICATE === "no";
exports.disableSongSelection = process.env.CONFIG_DISABLE_SONG_SELECTION === "yes";
exports.searchMaxResults = Number(process.env.CONFIG_SEARCH_MAX_RESULTS) || 10;
if (exports.searchMaxResults < 1)
    throw new Error("CONFIG_SEARCH_MAX_RESULTS cannot be smaller than 1");
if (exports.searchMaxResults > 10)
    throw new Error("CONFIG_SEARCH_MAX_RESULTS cannot be higher than 10");
exports.selectTimeout = Number(process.env.CONFIG_SELECT_TIMEOUT) * 1000 || 20 * 1000;
exports.deleteQueueTimeout = Number(process.env.CONFIG_DELETE_QUEUE_TIMEOUT) * 1000 || 180 * 1000;
exports.cacheYoutubeDownloads = process.env.CONFIG_CACHE_YOUTUBE_DOWNLOADS === "yes";
exports.cacheMaxLengthAllowed = Number(process.env.CONFIG_CACHE_MAX_LENGTH) || 5400;
exports.disableInviteCmd = process.env.CONFIG_DISABLE_INVITE_CMD === "no";
exports.debug = process.env.CONFIG_DEBUG === "yes";
exports.status = {
    type: (_j = (_h = process.env.STATUS_TYPE) === null || _h === void 0 ? void 0 : _h.toUpperCase()) !== null && _j !== void 0 ? _j : "LISTENING",
    activity: (_k = process.env.CONFIG_STATUS_ACTIVITY) !== null && _k !== void 0 ? _k : "music on {guildsCount}"
};
exports.fetchAllUsers = process.env.CONFIG_FETCH_ALL_USERS === "yes";
