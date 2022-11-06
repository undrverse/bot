"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Playlist = void 0;
const Video_1 = require("./Video");
class Playlist {
    constructor(yt, raw) {
        this.yt = yt;
        this.raw = raw;
        this.id = raw.id;
        this.url = `https://youtube.com/playlist?vlist=${raw.id}`;
        this.title = raw.snippet.title;
        this.description = raw.snippet.description;
        this.channel = {
            id: raw.snippet.channelId,
            name: raw.snippet.channelTitle,
            url: `https://www.youtube.com/channel/${raw.snippet.channelId}`
        };
        this.thumbnails = raw.snippet.thumbnails;
        this.itemCount = raw.contentDetails.itemCount;
        this.privacyStatus = raw.status.privacyStatus;
        this.createdAt = new Date(raw.snippet.publishedAt);
    }
    async getVideos() {
        const videos = await this.yt.request.paginate.all("playlistItems", {
            searchParams: { maxResults: 50, playlistId: this.id },
            pagination: {
                paginate: (response, allItems) => {
                    const { nextPageToken, prevPageToken } = response.body;
                    if (nextPageToken === prevPageToken)
                        return false;
                    if (allItems.length >= this.itemCount)
                        return false;
                    return {
                        searchParams: {
                            ...response.request.options.searchParams,
                            pageToken: nextPageToken
                        }
                    };
                },
                transform: (response) => response.body.items,
                countLimit: this.itemCount
            }
        });
        return videos.map((i) => new Video_1.Video(this.yt, i, "playlistItem"));
    }
}
exports.Playlist = Playlist;
