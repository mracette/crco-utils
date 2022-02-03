"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CanvasCoordinates = void 0;
var isSomeUndefined_1 = require("../js/isSomeUndefined");
var isUndefined_1 = require("../js/isUndefined");
var lerp_1 = require("../math/lerp");
var normalize_1 = require("../math/normalize");
var YAxisOrientation;
(function (YAxisOrientation) {
    YAxisOrientation["Up"] = "up";
    YAxisOrientation["Down"] = "down";
})(YAxisOrientation || (YAxisOrientation = {}));
var CanvasCoordinates = /** @class */ (function () {
    function CanvasCoordinates(opts) {
        if (opts === void 0) { opts = {}; }
        if ((0, isUndefined_1.isUndefined)(opts.canvas) &&
            (0, isSomeUndefined_1.isSomeUndefined)(opts.baseWidth, opts.baseHeight)) {
            throw new Error("Invalid options. A canvas element must be supplied if baseHeight or baseWidth are not defined.");
        }
        var defaults = {
            nxRange: [-1, 1],
            nyRange: [-1, 1],
            clamp: false,
            orientationY: "down",
            equalPadding: false
        };
        Object.assign(this, __assign(__assign({}, defaults), opts));
    }
    CanvasCoordinates.prototype.getBaseWidth = function () {
        var _a;
        return (_a = this.baseWidth) !== null && _a !== void 0 ? _a : this.canvas.width;
    };
    CanvasCoordinates.prototype.getBaseWidthMinusPadding = function () {
        return this.getBaseWidth() - this.getPaddingXCanvasUnits() * 2;
    };
    CanvasCoordinates.prototype.getBaseHeight = function () {
        var _a;
        return (_a = this.baseHeight) !== null && _a !== void 0 ? _a : this.canvas.height;
    };
    CanvasCoordinates.prototype.getBaseHeightMinusPadding = function () {
        return this.getBaseHeight() - this.getPaddingYCanvasUnits() * 2;
    };
    CanvasCoordinates.prototype.getPaddingX = function () {
        var _a, _b;
        return (_b = (_a = this.paddingX) !== null && _a !== void 0 ? _a : this.padding) !== null && _b !== void 0 ? _b : 0;
    };
    CanvasCoordinates.prototype.getPaddingXCanvasUnits = function () {
        return this.getPaddingX() * this.getBaseWidth();
    };
    CanvasCoordinates.prototype.getPaddingY = function () {
        if (!(0, isUndefined_1.isUndefined)(this.paddingY)) {
            return this.paddingY;
        }
        if (!(0, isUndefined_1.isUndefined)(this.padding)) {
            if (this.equalPadding) {
                return this.padding * (this.getBaseWidth() / this.getBaseHeight());
            }
            return this.padding;
        }
        return 0;
    };
    CanvasCoordinates.prototype.getPaddingYCanvasUnits = function () {
        return this.getPaddingY() * this.getBaseHeight();
    };
    CanvasCoordinates.prototype.getOffsetX = function () {
        var _a;
        return (_a = this.offsetX) !== null && _a !== void 0 ? _a : 0;
    };
    CanvasCoordinates.prototype.getOffsetY = function () {
        var _a;
        return (_a = this.offsetY) !== null && _a !== void 0 ? _a : 0;
    };
    /**
     * Maps a normalized value n to a x-coordinate on the canvas.
     */
    CanvasCoordinates.prototype.nx = function (n) {
        var nAdjusted = normalize_1.normalize.apply(void 0, __spreadArray(__spreadArray([n], this.nxRange, false), [this.clamp], false));
        return (this.getPaddingXCanvasUnits() +
            this.getOffsetX() +
            nAdjusted * this.getBaseWidthMinusPadding());
    };
    /**
     * Maps a normalized value n to a y-coordinate on the canvas.
     */
    CanvasCoordinates.prototype.ny = function (n) {
        var nAdjusted = normalize_1.normalize.apply(void 0, __spreadArray(__spreadArray([n], this.nyRange, false), [this.clamp], false));
        var inverse = this.yAxisOrientation === YAxisOrientation.Up ? true : false;
        return (this.getPaddingYCanvasUnits() +
            this.getOffsetY() +
            (inverse ? 1 - nAdjusted : nAdjusted) * this.getBaseHeightMinusPadding());
    };
    /**
     * Maps a canvas x-value to a normalized value n
     */
    CanvasCoordinates.prototype.xn = function (x) {
        var xAdjusted = (0, normalize_1.normalize)(x, this.getPaddingXCanvasUnits(), this.getPaddingXCanvasUnits() + this.width(), this.clamp);
        return lerp_1.lerp.apply(void 0, __spreadArray([xAdjusted], this.nxRange, false));
    };
    /**
     * Maps a canvas y-value to a normalized y-value.
     */
    CanvasCoordinates.prototype.yn = function (y) {
        var yAdjusted = (0, normalize_1.normalize)(y, this.getPaddingYCanvasUnits(), this.getPaddingYCanvasUnits() + this.height(), this.clamp);
        return lerp_1.lerp.apply(void 0, __spreadArray([yAdjusted], this.nxRange, false));
    };
    /**
     * Returns the width of the coordinate system, in canvas units, with an optional multiplier.
     * @param n - An optional multiplier
     * @returns The width of the coordinate system, in canvas units, multiplied by n
     */
    CanvasCoordinates.prototype.width = function (n) {
        return this.getBaseWidthMinusPadding() * (n !== null && n !== void 0 ? n : 1);
    };
    /**
     * Returns the height of the coordinate system, in canvas units, with an optional multiplier.
     * @param n - An optional multiplier
     * @returns The height of the coordinate system, in canvas units, multiplied by n
     */
    CanvasCoordinates.prototype.height = function (n) {
        return this.getBaseHeightMinusPadding() * (n !== null && n !== void 0 ? n : 1);
    };
    return CanvasCoordinates;
}());
exports.CanvasCoordinates = CanvasCoordinates;
