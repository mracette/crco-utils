"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aspectRatioResize = void 0;
var __1 = require("..");
var aspectRatioResize = function (element, aspect) {
    if (!element.parentElement) {
        console.warn("aspectRatioResize: element has no parent and cannot be resized");
        return null;
    }
    else {
        var parent_1 = element.parentElement;
        var x_1 = aspect.x, y_1 = aspect.y;
        var resizeToAspectRatio = function () {
            var _a = parent_1.getBoundingClientRect(), width = _a.width, height = _a.height;
            var resizeRatio = Math.min(width / x_1, height / y_1);
            var newWidth = resizeRatio * x_1;
            var newHeight = resizeRatio * y_1;
            if (element instanceof HTMLCanvasElement) {
                element.width = newWidth * __1.DPR;
                element.height = newHeight * __1.DPR;
            }
            element.style.width = newWidth + "px";
            element.style.height = newHeight + "px";
        };
        var observer = new ResizeObserver(resizeToAspectRatio);
        observer.observe(parent_1);
        return observer;
    }
};
exports.aspectRatioResize = aspectRatioResize;
