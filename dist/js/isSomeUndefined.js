"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSomeUndefined = void 0;
var isSomeUndefined = function () {
    var values = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        values[_i] = arguments[_i];
    }
    return values.some(function (value) { return typeof value === "undefined"; });
};
exports.isSomeUndefined = isSomeUndefined;
