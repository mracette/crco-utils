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
            styles: {},
            useNormalCoordinates: false
        };
        this.options = __assign(__assign({}, defaults), options);
    }
    Canvas2DGraphics.prototype.getStyleValue = function (key) {
        return this.getResolvedValueForStyles(key);
    };
    Canvas2DGraphics.prototype.applyStyles = function (styles) {
        this.assignStylesToContext(this.options.styles);
        this.assignStylesToContext(styles);
    };
    Canvas2DGraphics.prototype.rect = function (x, y, width, height, options) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (width === void 0) { width = 1; }
        if (height === void 0) { height = 1; }
        if (options === void 0) { options = {}; }
        var useNormalCoordinates = this.getResolvedValueForDrawingOptions("useNormalCoordinates", options);
        this.preDrawOps(options);
        var xAdj = useNormalCoordinates ? this.coords.nx(x) : x;
        var yAdj = useNormalCoordinates ? this.coords.ny(y) : y;
        var widthAdj = useNormalCoordinates
            ? this.coords.width(width / (this.coords.nxRange[1] - this.coords.nxRange[0]))
            : width;
        var heightAdj = useNormalCoordinates
            ? this.coords.height(height / (this.coords.nyRange[1] - this.coords.nyRange[0]))
            : height;
        this.context.rect(xAdj, yAdj, widthAdj, heightAdj);
        this.postDrawOps(options);
    };
    Canvas2DGraphics.prototype.lineSegments = function (points, options) {
        if (options === void 0) { options = {}; }
        var useNormalCoordinates = this.getResolvedValueForDrawingOptions("useNormalCoordinates", options);
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
        var useNormalCoordinates = this.getResolvedValueForDrawingOptions("useNormalCoordinates", options);
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
        var useNormalCoordinates = this.getResolvedValueForDrawingOptions("useNormalCoordinates", options);
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
    Canvas2DGraphics.prototype.getResolvedValueForDrawingOptions = function (param, options) {
        return (options && param in options ? options[param] : this.options[param]);
    };
    Canvas2DGraphics.prototype.getResolvedValueForStyles = function (param, styles) {
        var resolved = styles && param in styles ? styles[param] : this.options.styles[param];
        if (typeof resolved === "function") {
            return resolved(this.coords);
        }
        else {
            return resolved;
        }
    };
    /**
     * Creates a CSS style string for 'font' using a combination of related fields.
     *
     * Constructing the font string this way allows individual components of the
     * font style to be changed without needing to keep track of the entire font
     * string
     */
    Canvas2DGraphics.prototype.constructFontString = function (styles) {
        var fontSize = this.getResolvedValueForStyles("fontSize", styles);
        var lineHeight = this.getResolvedValueForStyles("lineHeight", styles);
        var fontStyle = this.getResolvedValueForStyles("fontStyle", styles);
        var fontFamily = this.getResolvedValueForStyles("fontFamily", styles);
        var fontWeight = this.getResolvedValueForStyles("fontWeight", styles);
        var fontStretch = this.getResolvedValueForStyles("fontStretch", styles);
        var fontSizePx = typeof fontSize === "number" ? "".concat(fontSize, "px") : undefined;
        if (lineHeight && fontSizePx) {
            fontSizePx = "".concat(fontSize, " / ").concat(lineHeight, "}");
        }
        return [fontSizePx, fontFamily, fontStyle, fontWeight, fontStretch].join(" ");
    };
    Canvas2DGraphics.prototype.assignStylesToContext = function (styles) {
        for (var key in styles) {
            var resolvedValue = this.getResolvedValueForStyles(key, styles);
            if (key === "transform") {
                this.context.setTransform(resolvedValue);
            }
            if (key === "scale") {
                var _a = resolvedValue, x = _a.x, y = _a.y;
                this.context.scale(x, y);
            }
            if (key === "rotation") {
                this.context.rotate(resolvedValue);
            }
            if (key === "translation") {
                var _b = resolvedValue, x = _b.x, y = _b.y;
                this.context.translate(x, y);
            }
            if (key === "lineDash") {
                this.context.setLineDash(resolvedValue);
            }
            if (key === "alpha") {
                this.context.globalAlpha = resolvedValue;
            }
            // @ts-ignore
            this.context[key] = this.getResolvedValueForStyles(key, styles);
        }
        this.context.font = this.constructFontString(styles);
    };
    Canvas2DGraphics.prototype.preDrawOps = function (options) {
        if (options === void 0) { options = {}; }
        if (this.getResolvedValueForDrawingOptions("saveAndRestore")) {
            this.context.save();
        }
        if (options.styles) {
            this.applyStyles(options.styles);
        }
        if (this.getResolvedValueForDrawingOptions("beginPath")) {
            this.context.beginPath();
        }
    };
    Canvas2DGraphics.prototype.postDrawOps = function (options) {
        if (this.getResolvedValueForDrawingOptions("closePath", options)) {
            this.context.closePath();
        }
        if (this.getResolvedValueForDrawingOptions("fill", options)) {
            this.context.fill();
        }
        if (this.getResolvedValueForDrawingOptions("stroke", options)) {
            this.context.stroke();
        }
        if (this.getResolvedValueForDrawingOptions("saveAndRestore", options)) {
            this.context.restore();
        }
    };
    return Canvas2DGraphics;
}());
exports.Canvas2DGraphics = Canvas2DGraphics;
