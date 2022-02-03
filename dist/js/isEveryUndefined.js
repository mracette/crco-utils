"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEveryUndefined = void 0;
var isEveryUndefined = function () {
    var values = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        values[_i] = arguments[_i];
    }
    return values.every(function (value) { return typeof value === "undefined"; });
};
exports.isEveryUndefined = isEveryUndefined;
