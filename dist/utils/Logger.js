"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLogger = void 0;
const tslib_1 = require("tslib");
const winston_1 = tslib_1.__importDefault(require("winston"));
const date_fns_1 = require("date-fns");
function createLogger(serviceName, debug = false) {
    const logger = winston_1.default.createLogger({
        defaultMeta: {
            serviceName
        },
        format: winston_1.default.format.combine(winston_1.default.format.printf(info => {
            const { level, message, stack } = info;
            const prefix = `[${date_fns_1.format(Date.now(), "yyyy-MM-dd HH:mm:ss (x)")}] [${level}]`;
            if (["error", "crit"].includes(level))
                return `${prefix}: ${stack}`;
            return `${prefix}: ${message}`;
        })),
        level: debug ? "debug" : "info",
        levels: {
            alert: 1,
            debug: 5,
            error: 0,
            info: 4,
            notice: 3,
            warn: 2
        },
        transports: [
            new winston_1.default.transports.File({ filename: `logs/${serviceName}/error-${date_fns_1.format(Date.now(), "yyyy-MM-dd-HH-mm-ss")}.log`, level: "error" }),
            new winston_1.default.transports.File({ filename: `logs/${serviceName}/logs-${date_fns_1.format(Date.now(), "yyyy-MM-dd-HH-mm-ss")}.log` })
        ]
    });
    logger.add(new winston_1.default.transports.Console({
        level: debug ? "debug" : "info",
        format: winston_1.default.format.combine(winston_1.default.format.printf(info => {
            const { level, message, stack } = info;
            const prefix = `[${date_fns_1.format(Date.now(), "yyyy-MM-dd HH:mm:ss (x)")}] [${level}]`;
            if (["error", "alert"].includes(level))
                return `${prefix}: ${stack}`;
            return `${prefix}: ${message}`;
        }), winston_1.default.format.align(), winston_1.default.format.colorize({ all: true }))
    }));
    return logger;
}
exports.createLogger = createLogger;
