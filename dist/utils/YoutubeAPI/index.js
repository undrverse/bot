"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YoutubeAPI = void 0;
const tslib_1 = require("tslib");
/* eslint-disable @typescript-eslint/explicit-function-return-type */
const got_1 = tslib_1.__importDefault(require("got"));
const url_1 = tslib_1.__importDefault(require("url"));
const querystring_1 = tslib_1.__importDefault(require("querystring"));
const Playlist_1 = require("./structures/Playlist");
const Video_1 = require("./structures/Video");
class YoutubeAPI {
    constructor(key) {
        this.request = got_1.default;
        this.request = got_1.default.extend({
            prefixUrl: "https://www.googleapis.com/youtube/v3/",
            searchParams: { key, part: "snippet,id,status,contentDetails" },
            responseType: "json"
        });
    }
    async getVideo(id) {
        const raw = await this.request.get("videos", { searchParams: { id, maxResults: 1 } });
        return new Video_1.Video(this, await raw.body.items[0]);
    }
    getVideoByURL(url) {
        const id = querystring_1.default.parse(url_1.default.parse(url).query).v;
        return this.getVideo(id);
    }
    async getPlaylist(id) {
        const raw = await this.request.get("playlists", { searchParams: { id, maxResults: 1 } });
        return new Playlist_1.Playlist(this, raw.body.items[0]);
    }
    getPlaylistByURL(url) {
        const id = querystring_1.default.parse(url_1.default.parse(url).query).list;
        return this.getPlaylist(id);
    }
    async searchVideos(q, maxResults = 5) {
        const videos = await this.request.paginate.all("search", {
            searchParams: { maxResults, part: "snippet", q, safeSearch: "none", type: "video" },
            pagination: {
                paginate: (response, allItems) => {
                    const { nextPageToken, prevPageToken } = response.body;
                    if (nextPageToken === prevPageToken)
                        return false;
                    if (allItems.length >= maxResults)
                        return false;
                    return {
                        searchParams: {
                            ...response.request.options.searchParams,
                            pageToken: nextPageToken
                        }
                    };
                },
                transform: (response) => response.body.items,
                countLimit: maxResults
            }
        });
        return videos.map((i) => new Video_1.Video(this, i, "searchResults"));
    }
}
exports.YoutubeAPI = YoutubeAPI;
