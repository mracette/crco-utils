"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lerp_1 = require("./lerp");
test("lerp - negative + positive", function () {
    expect((0, lerp_1.lerp)(0, -1, 1)).toBe(-1);
    expect((0, lerp_1.lerp)(0.5, -1, 1)).toBe(0);
    expect((0, lerp_1.lerp)(1, -1, 1)).toBe(1);
});
test("lerp - negative + negative", function () {
    expect((0, lerp_1.lerp)(0, -2, -1)).toBe(-2);
    expect((0, lerp_1.lerp)(0.5, -2, -1)).toBe(-1.5);
    expect((0, lerp_1.lerp)(1, -2, -1)).toBe(-1);
});
test("lerp - positive + positive", function () {
    expect((0, lerp_1.lerp)(0, 1, 2)).toBe(1);
    expect((0, lerp_1.lerp)(0.5, 1, 2)).toBe(1.5);
    expect((0, lerp_1.lerp)(1, 1, 2)).toBe(2);
});
