"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var boundedSine_1 = require("./boundedSine");
var fn = (0, boundedSine_1.boundedSine)();
test("defaults", function () {
    fn = (0, boundedSine_1.boundedSine)();
    expect(fn(0)).toBeCloseTo(0);
    expect(fn(0.25)).toBeCloseTo(1);
    expect(fn(0.5)).toBeCloseTo(0);
    expect(fn(0.75)).toBeCloseTo(-1);
    expect(fn(1)).toBeCloseTo(0);
});
describe("yBounds", function () {
    /**
     * This function is only a valid test if yStart = (yMin + yMax) / 2 and
     * translateX = translateY = 0.
     */
    var testInflectionPoints = function (fn, yStart, yMin, yMax, period) {
        expect(fn(period * 0)).toBeCloseTo(yStart);
        expect(fn(period * 0.25)).toBeCloseTo(yMax);
        expect(fn(period * 0.5)).toBeCloseTo(yStart);
        expect(fn(period * 0.75)).toBeCloseTo(yMin);
        expect(fn(period * 1)).toBeCloseTo(yStart);
    };
    test("negative and positive bounds", function () {
        var PERIOD = Math.random() * 100;
        var Y_START = 0;
        var Y_MIN = -5;
        var Y_MAX = 5;
        fn = (0, boundedSine_1.boundedSine)({ yMin: Y_MIN, yMax: Y_MAX, yStart: Y_START, period: PERIOD });
        testInflectionPoints(fn, Y_START, Y_MIN, Y_MAX, PERIOD);
    });
    test("positive bounds", function () {
        var PERIOD = Math.random() * 100;
        var Y_START = 15;
        var Y_MIN = 10;
        var Y_MAX = 20;
        fn = (0, boundedSine_1.boundedSine)({ yMin: Y_MIN, yMax: Y_MAX, yStart: Y_START, period: PERIOD });
        testInflectionPoints(fn, Y_START, Y_MIN, Y_MAX, PERIOD);
    });
    test("negative bounds", function () {
        var PERIOD = Math.random() * 100;
        var Y_START = -15;
        var Y_MIN = -20;
        var Y_MAX = -10;
        fn = (0, boundedSine_1.boundedSine)({ yMin: Y_MIN, yMax: Y_MAX, yStart: Y_START, period: PERIOD });
        testInflectionPoints(fn, Y_START, Y_MIN, Y_MAX, PERIOD);
    });
});
test("yStart, yTranslate, xTranslate, period", function () {
    var testYStart = function (fn, yStart, yTranslate, xTranslate, period) {
        expect(fn(xTranslate)).toBeCloseTo(yStart + yTranslate);
        expect(fn(xTranslate + period)).toBeCloseTo(yStart + yTranslate);
    };
    var SCALE = 10;
    for (var i = 0; i < 10; i++) {
        var yStart = Math.random() * SCALE;
        var yMin = yStart - Math.random() * SCALE;
        var yMax = yStart + Math.random() * SCALE;
        var translateX = Math.random() * SCALE;
        var translateY = Math.random() * SCALE;
        var period = Math.random() * SCALE;
        var fn_1 = (0, boundedSine_1.boundedSine)({ yStart: yStart, yMin: yMin, yMax: yMax, translateX: translateX, translateY: translateY, period: period });
        testYStart(fn_1, yStart, translateY, translateX, period);
    }
});
describe("valid yStart", function () {
    test("throws error", function () {
        expect(function () { return (0, boundedSine_1.boundedSine)({ yMin: 0, yMax: 5, yStart: -1 }); }).toThrow("yStart must be between yMin and yMax");
        expect(function () { return (0, boundedSine_1.boundedSine)({ yMin: 6, yMax: 5, yStart: -1 }); }).toThrow("yStart must be between yMin and yMax");
    });
    test("does not throw error", function () {
        expect(function () { return (0, boundedSine_1.boundedSine)({ yMin: 0, yMax: 5, yStart: 0 }); });
        expect(function () { return (0, boundedSine_1.boundedSine)({ yMin: 6, yMax: 5, yStart: 5 }); });
    });
});
