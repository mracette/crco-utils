"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clamp = void 0;
var clamp = function (n, min, max) {
    return Math.max(Math.min(max, n), min);
};
exports.clamp = clamp;
