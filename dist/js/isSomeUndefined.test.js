"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var isSomeUndefined_1 = require("./isSomeUndefined");
test("one argument", function () {
    expect((0, isSomeUndefined_1.isSomeUndefined)(true)).toBe(false);
    expect((0, isSomeUndefined_1.isSomeUndefined)(false)).toBe(false);
    expect((0, isSomeUndefined_1.isSomeUndefined)("test")).toBe(false);
    expect((0, isSomeUndefined_1.isSomeUndefined)(27)).toBe(false);
    expect((0, isSomeUndefined_1.isSomeUndefined)(NaN)).toBe(false);
    expect((0, isSomeUndefined_1.isSomeUndefined)(Boolean)).toBe(false);
    expect((0, isSomeUndefined_1.isSomeUndefined)(null)).toBe(false);
    expect((0, isSomeUndefined_1.isSomeUndefined)({})).toBe(false);
    expect((0, isSomeUndefined_1.isSomeUndefined)([])).toBe(false);
    expect((0, isSomeUndefined_1.isSomeUndefined)(undefined)).toBe(true);
});
test("multiple arguments", function () {
    expect((0, isSomeUndefined_1.isSomeUndefined)(true, false)).toBe(false);
    expect((0, isSomeUndefined_1.isSomeUndefined)("test", 27)).toBe(false);
    expect((0, isSomeUndefined_1.isSomeUndefined)(27, 1, 0, 8)).toBe(false);
    expect((0, isSomeUndefined_1.isSomeUndefined)(Boolean, 23, "test")).toBe(false);
    expect((0, isSomeUndefined_1.isSomeUndefined)(null, false, Boolean, 2, true)).toBe(false);
    expect((0, isSomeUndefined_1.isSomeUndefined)({}, [], null, 2, "test")).toBe(false);
    expect((0, isSomeUndefined_1.isSomeUndefined)("test", undefined)).toBe(true);
    expect((0, isSomeUndefined_1.isSomeUndefined)(undefined, undefined)).toBe(true);
});
