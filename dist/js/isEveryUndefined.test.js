"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var isEveryUndefined_1 = require("./isEveryUndefined");
test("one argument", function () {
    expect((0, isEveryUndefined_1.isEveryUndefined)(true)).toBe(false);
    expect((0, isEveryUndefined_1.isEveryUndefined)(false)).toBe(false);
    expect((0, isEveryUndefined_1.isEveryUndefined)("test")).toBe(false);
    expect((0, isEveryUndefined_1.isEveryUndefined)(27)).toBe(false);
    expect((0, isEveryUndefined_1.isEveryUndefined)(NaN)).toBe(false);
    expect((0, isEveryUndefined_1.isEveryUndefined)(Boolean)).toBe(false);
    expect((0, isEveryUndefined_1.isEveryUndefined)(null)).toBe(false);
    expect((0, isEveryUndefined_1.isEveryUndefined)({})).toBe(false);
    expect((0, isEveryUndefined_1.isEveryUndefined)([])).toBe(false);
    expect((0, isEveryUndefined_1.isEveryUndefined)(undefined)).toBe(true);
});
test("multiple arguments", function () {
    expect((0, isEveryUndefined_1.isEveryUndefined)(true, false)).toBe(false);
    expect((0, isEveryUndefined_1.isEveryUndefined)("test", 27)).toBe(false);
    expect((0, isEveryUndefined_1.isEveryUndefined)(27, 1, 0, 8)).toBe(false);
    expect((0, isEveryUndefined_1.isEveryUndefined)(Boolean, 23, "test")).toBe(false);
    expect((0, isEveryUndefined_1.isEveryUndefined)(null, false, Boolean, 2, true)).toBe(false);
    expect((0, isEveryUndefined_1.isEveryUndefined)({}, [], null, 2, "test")).toBe(false);
    expect((0, isEveryUndefined_1.isEveryUndefined)("test", undefined)).toBe(false);
    expect((0, isEveryUndefined_1.isEveryUndefined)(undefined, undefined)).toBe(true);
});
