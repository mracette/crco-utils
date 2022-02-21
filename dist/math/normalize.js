"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalize = void 0;
var clamp_1 = require("./clamp");
var normalize = function (n, min, max, clamp) {
    if (clamp === void 0) { clamp = false; }
    return ((clamp ? (0, clamp_1.clamp)(n, min, max) : n) - min) / (max - min);
};
exports.normalize = normalize;
