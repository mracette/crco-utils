"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lerp = void 0;
var lerp = function (t, n0, n1) {
    return n0 * (1 - t) + n1 * t;
};
exports.lerp = lerp;
