"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatMS = void 0;
const date_fns_1 = require("date-fns");
function formatMS(ms) {
    if (isNaN(ms))
        throw new Error("value is not a number.");
    return date_fns_1.formatDuration(date_fns_1.intervalToDuration({ start: 0, end: ms }));
}
exports.formatMS = formatMS;
