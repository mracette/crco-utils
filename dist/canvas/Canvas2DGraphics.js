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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Canvas2DGraphics = exports.CanvasDimensions = void 0;
var __1 = require("..");
var constants_1 = require("../js/constants");
var CanvasDimensions;
(function (CanvasDimensions) {
    CanvasDimensions["Width"] = "width";
    CanvasDimensions["Height"] = "height";
})(CanvasDimensions = exports.CanvasDimensions || (exports.CanvasDimensions = {}));
var Canvas2DGraphics = /** @class */ (function () {
    function Canvas2DGraphics(context, coords, options) {
        this.context = context;
        this.coords = coords !== null && coords !== void 0 ? coords : new __1.CanvasCoordinates({ canvas: context.canvas });
        var defaults = {
            beginPath: true,
            closePath: false,
            fill: false,
            maxTextWidth: undefined,
            saveAndRestore: true,
            stroke: false,
            styles: undefined,
            useNormalCoordinates: false
        };
        this.options = __assign(__assign({}, defaults), options);
    }
    Canvas2DGraphics.prototype.assignStyleToContext = function (style) {
        // run font and font size up front, because fontSize must run after font
        for (var key in style) {
            if (key === "lineDash") {
                this.context.setLineDash(style[key]);
            }
            if (key === "alpha") {
                this.context.globalAlpha = style[key];
            }
            if (key === "lineWidth" && style.lineWidthIsProportionalTo === "width") {
                this.context.lineWidth = this.coords.width(style[key]);
                delete style.lineWidthIsProportionalTo;
            }
            if (key === "lineWidth" && style.lineWidthIsProportionalTo === "height") {
                this.context.lineWidth = this.coords.height(style[key]);
                delete style.lineWidthIsProportionalTo;
            }
            if (!(key in this.context)) {
                continue;
            }
            // @ts-ignore
            this.context[key] = style[key];
        }
        // set font as a combination of related fields
        var fontSize;
        if (style.fontSizeIsProportionalTo === "width") {
            fontSize = this.coords.width(style.fontSize);
        }
        else if (style.fontSizeIsProportionalTo === "height") {
            fontSize = this.coords.height(style.fontSize);
        }
        else {
            // eslint-disable-next-line prefer-destructuring
            fontSize = style.fontSize;
        }
        fontSize = fontSize + "px";
        if (style.lineHeight) {
            fontSize = fontSize + "/" + style.lineHeight;
        }
        this.context.font = [
            fontSize,
            style.fontFamily,
            style.fontStyle,
            style.fontWeight,
            style.fontStretch
        ].join(" ");
    };
    Canvas2DGraphics.prototype.preDrawOps = function (options) {
        var _a, _b;
        if (options === void 0) { options = {}; }
        ((_a = options.saveAndRestore) !== null && _a !== void 0 ? _a : this.options.saveAndRestore) && this.context.save();
        // apply base styles first
        this.options.styles && this.applyStyles(this.options.styles);
        // override with more specific styles
        options.styles && this.applyStyles(options.styles);
        ((_b = options.beginPath) !== null && _b !== void 0 ? _b : this.options.beginPath) && this.context.beginPath();
    };
    Canvas2DGraphics.prototype.postDrawOps = function (options) {
        var _a, _b, _c, _d;
        ((_a = options.closePath) !== null && _a !== void 0 ? _a : this.options.closePath) && this.context.closePath();
        ((_b = options.fill) !== null && _b !== void 0 ? _b : this.options.fill) && this.context.fill();
        ((_c = options.stroke) !== null && _c !== void 0 ? _c : this.options.stroke) && this.context.stroke();
        ((_d = options.saveAndRestore) !== null && _d !== void 0 ? _d : this.options.saveAndRestore) &&
            this.context.restore();
    };
    Canvas2DGraphics.prototype.applyStyles = function (styles) {
        if (Array.isArray(styles)) {
            for (var _i = 0, styles_1 = styles; _i < styles_1.length; _i++) {
                var style = styles_1[_i];
                this.assignStyleToContext(style);
            }
        }
        else {
            this.assignStyleToContext(styles);
        }
    };
    Canvas2DGraphics.prototype.rect = function (x, y, width, height, options) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (width === void 0) { width = 1; }
        if (height === void 0) { height = 1; }
        if (options === void 0) { options = {}; }
        var _a = options.useNormalCoordinates, useNormalCoordinates = _a === void 0 ? this.options.useNormalCoordinates : _a;
        this.preDrawOps(options);
        var xAdj = useNormalCoordinates ? this.coords.nx(x) : x;
        var yAdj = useNormalCoordinates ? this.coords.ny(y) : y;
        var widthAdj = useNormalCoordinates ? this.coords.width(width) : width;
        var heightAdj = useNormalCoordinates ? this.coords.height(height) : height;
        this.context.rect(xAdj, yAdj, widthAdj, heightAdj);
        this.postDrawOps(options);
    };
    Canvas2DGraphics.prototype.lineSegments = function (points, options) {
        if (options === void 0) { options = {}; }
        var _a = options.useNormalCoordinates, useNormalCoordinates = _a === void 0 ? this.options.useNormalCoordinates : _a;
        this.preDrawOps(options);
        for (var i = 0; i < points.length; i++) {
            var x = useNormalCoordinates ? this.coords.nx(points[i][0]) : points[i][0];
            var y = useNormalCoordinates ? this.coords.ny(points[i][1]) : points[i][1];
            if (i === 0) {
                this.context.moveTo(x, y);
            }
            else {
                this.context.lineTo(x, y);
            }
        }
        this.postDrawOps(options);
    };
    Canvas2DGraphics.prototype.text = function (text, cx, cy, options) {
        var _a;
        if (options === void 0) { options = {}; }
        var _b = options.useNormalCoordinates, useNormalCoordinates = _b === void 0 ? this.options.useNormalCoordinates : _b;
        this.preDrawOps(options);
        this.context.fillText(text, useNormalCoordinates ? this.coords.nx(cx) : cx, useNormalCoordinates ? this.coords.ny(cy) : cy, (_a = options.maxTextWidth) !== null && _a !== void 0 ? _a : this.options.maxTextWidth);
        this.postDrawOps(options);
    };
    /**
     * @defaultValue options.beginPath = true
     * @defaultValue options.saveAndRestore = true
     * @defaultValue options.fill = true
     */
    Canvas2DGraphics.prototype.circle = function (cx, cy, r, options) {
        if (options === void 0) { options = {}; }
        var _a = options.useNormalCoordinates, useNormalCoordinates = _a === void 0 ? this.options.useNormalCoordinates : _a;
        this.preDrawOps(options);
        this.context.arc(useNormalCoordinates ? this.coords.nx(cx) : cx, useNormalCoordinates ? this.coords.ny(cy) : cy, r, 0, __1.TAU);
        this.postDrawOps(options);
    };
    Canvas2DGraphics.prototype.clear = function () {
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    };
    /**
     * An alternative to context.clearRect() that can be run at the beginning of a draw loop.
     * This form has two advantages over clearRect:
     *
     * 1. For clearRect you need to either have an untransformed context, or keep track of your actual boundaries.
     *    Otherwise you may not be able to clear the entire canvas on each frame.
     *
     * 2. clearRect does not clear the state stack that is used by the canvas context when methods like save() and restore() are called.
     *    If these functions are being called anywhere in a render loop, some browsers (Firefox) will continue to add to the state stack
     *    leading to deteriorating performance over time. In this case, it is much better to use this function to clear the canvas for
     *    each frame.
     *
     * TODO: more investigation is needed. Why is this necessary on Firefox? Is it the save/restore stack or is this issue only present
     * when beginPath() is not called properly before each path? Or is there another reason?
     *
     */
    Canvas2DGraphics.prototype.clearCanvasAndState = function (canvas, options) {
        if (options === void 0) { options = {}; }
        canvas.width = canvas.clientWidth * (options.dpr ? constants_1.DPR : 1);
        canvas.height = canvas.clientHeight * (options.dpr ? constants_1.DPR : 1);
    };
    return Canvas2DGraphics;
}());
exports.Canvas2DGraphics = Canvas2DGraphics;
