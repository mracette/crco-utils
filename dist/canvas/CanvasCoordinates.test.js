"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CanvasCoordinates_1 = require("./CanvasCoordinates");
var coords;
// a simple canvas mock
var canvas = {
    width: 100,
    height: 100
};
var testXnAndInverse = function (coords, n, x) {
    expect(coords.nx(n)).toBe(x);
    expect(coords.xn(x)).toBe(n);
};
var testYnAndInverse = function (coords, n, y) {
    expect(coords.ny(n)).toBe(y);
    expect(coords.yn(y)).toBe(n);
};
test("initialization errors", function () {
    expect(function () {
        new CanvasCoordinates_1.CanvasCoordinates();
    }).toThrow();
    expect(function () {
        new CanvasCoordinates_1.CanvasCoordinates({ baseWidth: 1 });
    }).toThrow();
    expect(function () {
        new CanvasCoordinates_1.CanvasCoordinates({ baseHeight: 1 });
    }).toThrow();
    expect(function () {
        new CanvasCoordinates_1.CanvasCoordinates({ baseWidth: 1, baseHeight: 1 });
    }).not.toThrow();
    expect(function () {
        new CanvasCoordinates_1.CanvasCoordinates({ canvas: canvas });
    }).not.toThrow();
});
describe("padding", function () {
    test("base padding is proportional to dimensions", function () {
        canvas = { width: 100, height: 200 };
        coords = new CanvasCoordinates_1.CanvasCoordinates({
            canvas: canvas,
            padding: 0.1
        });
        testXnAndInverse(coords, -1, 10);
        testXnAndInverse(coords, 1, 90);
        testYnAndInverse(coords, -1, 20);
        testYnAndInverse(coords, 1, 180);
    });
    test("x and y padding are equal when equalPadding is true", function () {
        canvas = { width: 100, height: 200 };
        coords = new CanvasCoordinates_1.CanvasCoordinates({
            canvas: canvas,
            padding: 0.1,
            equalPadding: true
        });
        expect(coords.nx(-1)).toEqual(coords.ny(-1));
        expect(canvas.width - coords.nx(1)).toEqual(canvas.height - coords.ny(1));
        canvas = { width: 200, height: 100 };
        coords = new CanvasCoordinates_1.CanvasCoordinates({
            canvas: canvas,
            padding: 0.1,
            equalPadding: true
        });
        expect(coords.nx(-1)).toEqual(coords.ny(-1));
        expect(canvas.width - coords.nx(1)).toEqual(canvas.height - coords.ny(1));
    });
    test("separate padding for x and y", function () {
        canvas = { width: 100, height: 200 };
        coords = new CanvasCoordinates_1.CanvasCoordinates({
            canvas: canvas,
            paddingX: 0.1,
            paddingY: 0.2
        });
        testXnAndInverse(coords, -1, 10);
        testXnAndInverse(coords, 1, 90);
        testYnAndInverse(coords, -1, 40);
        testYnAndInverse(coords, 1, 160);
    });
});
describe("width and height", function () {
    test("width", function () {
        canvas = { width: 100, height: 100 };
        coords = new CanvasCoordinates_1.CanvasCoordinates({
            canvas: canvas
        });
        expect(coords.width()).toBe(100);
        expect(coords.width(0.5)).toBe(50);
        expect(coords.width(2)).toBe(200);
        coords = new CanvasCoordinates_1.CanvasCoordinates({
            baseWidth: 100,
            baseHeight: 100
        });
        expect(coords.width()).toBe(100);
        expect(coords.width(0.5)).toBe(50);
        expect(coords.width(2)).toBe(200);
    });
    test("height", function () {
        canvas = { width: 100, height: 100 };
        coords = new CanvasCoordinates_1.CanvasCoordinates({
            canvas: canvas
        });
        expect(coords.height()).toBe(100);
        expect(coords.height(0.5)).toBe(50);
        expect(coords.height(2)).toBe(200);
        coords = new CanvasCoordinates_1.CanvasCoordinates({
            baseWidth: 100,
            baseHeight: 100
        });
        expect(coords.height()).toBe(100);
        expect(coords.height(0.5)).toBe(50);
        expect(coords.height(2)).toBe(200);
    });
});
