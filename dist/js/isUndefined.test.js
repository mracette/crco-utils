"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var isUndefined_1 = require("./isUndefined");
test("is undefined", function () {
    expect((0, isUndefined_1.isUndefined)(true)).toBe(false);
    expect((0, isUndefined_1.isUndefined)(false)).toBe(false);
    expect((0, isUndefined_1.isUndefined)("test")).toBe(false);
    expect((0, isUndefined_1.isUndefined)(27)).toBe(false);
    expect((0, isUndefined_1.isUndefined)(NaN)).toBe(false);
    expect((0, isUndefined_1.isUndefined)(Boolean)).toBe(false);
    expect((0, isUndefined_1.isUndefined)(null)).toBe(false);
    expect((0, isUndefined_1.isUndefined)({})).toBe(false);
    expect((0, isUndefined_1.isUndefined)([])).toBe(false);
    expect((0, isUndefined_1.isUndefined)(undefined)).toBe(true);
});
