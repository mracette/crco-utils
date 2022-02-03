"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var normalize_1 = require("./normalize");
describe("normalize - negative + positive", function () {
    test("within bounds", function () {
        expect((0, normalize_1.normalize)(-1, -1, 1)).toBe(0);
        expect((0, normalize_1.normalize)(0, -1, 1)).toBe(0.5);
        expect((0, normalize_1.normalize)(1, -1, 1)).toBe(1);
    });
    test("out of bounds", function () {
        expect((0, normalize_1.normalize)(-3, -1, 1)).toBe(-1);
        expect((0, normalize_1.normalize)(3, -1, 1)).toBe(2);
    });
    test("out of bounds with clamp", function () {
        expect((0, normalize_1.normalize)(-3, -1, 1, true)).toBe(0);
        expect((0, normalize_1.normalize)(3, -1, 1, true)).toBe(1);
    });
});
describe("normalize - negative + negative", function () {
    test("within bounds", function () {
        expect((0, normalize_1.normalize)(-2, -2, -1)).toBe(0);
        expect((0, normalize_1.normalize)(-1.5, -2, -1)).toBe(0.5);
        expect((0, normalize_1.normalize)(-1, -2, -1)).toBe(1);
    });
    test("out of bounds", function () {
        expect((0, normalize_1.normalize)(-3, -2, -1)).toBe(-1);
        expect((0, normalize_1.normalize)(0, -2, -1)).toBe(2);
    });
    test("out of bounds with clamp", function () {
        expect((0, normalize_1.normalize)(-3, -2, -1, true)).toBe(0);
        expect((0, normalize_1.normalize)(0, -2, -1, true)).toBe(1);
    });
});
describe("normalize - positive + positive", function () {
    test("within bounds", function () {
        expect((0, normalize_1.normalize)(1, 1, 2)).toBe(0);
        expect((0, normalize_1.normalize)(1.5, 1, 2)).toBe(0.5);
        expect((0, normalize_1.normalize)(2, 1, 2)).toBe(1);
    });
    test("out of bounds", function () {
        expect((0, normalize_1.normalize)(0, 1, 2)).toBe(-1);
        expect((0, normalize_1.normalize)(3, 1, 2)).toBe(2);
    });
    test("out of bounds with clamp", function () {
        expect((0, normalize_1.normalize)(0, 1, 2, true)).toBe(0);
        expect((0, normalize_1.normalize)(3, 1, 2, true)).toBe(1);
    });
});
