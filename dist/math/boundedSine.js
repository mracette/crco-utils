"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.boundedSine = void 0;
var constants_1 = require("./constants");
/**
 * Returns a sine function fx such that fx(0) = yStart,
 * and yMin \<= fx(x) \<= yMax.
 */
var boundedSine = function (_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.yStart, yStart = _c === void 0 ? 0 : _c, _d = _b.yMin, yMin = _d === void 0 ? -1 : _d, _e = _b.yMax, yMax = _e === void 0 ? 1 : _e, _f = _b.period, period = _f === void 0 ? 1 : _f, _g = _b.translateX, translateX = _g === void 0 ? 0 : _g, _h = _b.translateY, translateY = _h === void 0 ? 0 : _h, _j = _b.invert, invert = _j === void 0 ? false : _j;
    if (yStart < yMin || yStart > yMax) {
        throw new Error("yStart must be between yMin and yMax");
    }
    var average = (yMin + yMax) / 2;
    var amplitude = (yMax - yMin) / 2;
    var inverse = invert ? -1 : 1;
    var phaseShift = Math.asin((2 * (yStart - yMin)) / (yMax - yMin) - 1) * (period / constants_1.TAU);
    return function (n) {
        return average +
            amplitude * inverse * Math.sin((constants_1.TAU * (n - translateX + phaseShift)) / period) +
            translateY;
    };
};
exports.boundedSine = boundedSine;
