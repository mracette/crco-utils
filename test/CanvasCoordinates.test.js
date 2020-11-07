// import { CanvasCoordinates } from "../src/classes/CanvasCoordinates";

const crco = require("../build/crco-utils");

// a simple canvas mock with a height and width property
const canvas = {
  width: 100,
  height: 100,
};

let coords;

test("initialization errors", () => {
  expect(() => {
    new crco.CanvasCoordinates();
  }).toThrow();
  expect(() => {
    new crco.CanvasCoordinates({ baseWidth: 1 });
  }).toThrow();
  expect(() => {
    new crco.CanvasCoordinates({ baseHeight: 1 });
  }).toThrow();
  expect(() => {
    new crco.CanvasCoordinates({ baseWidth: 1, baseHeight: 1 });
  }).not.toThrow();
  expect(() => {
    new crco.CanvasCoordinates({ canvas });
  }).not.toThrow();
});

test("padding", () => {
  coords = new crco.CanvasCoordinates({
    baseWidth: 100,
    baseHeight: 200,
    padding: 0.1,
  });
  // handles basic padding
  expect(coords.nx(-1)).toBe(10);
  expect(coords.nx(1)).toBe(90);
  // y-padding should be the same magnitude as x padding despite having 2x the height
  expect(coords.ny(-1)).toBe(10);
  expect(coords.ny(1)).toBe(190);
});

test("padding-x", () => {
  coords = new crco.CanvasCoordinates({
    baseWidth: 100,
    baseHeight: 100,
    paddingX: 0.1,
    padding: 0.5,
  });
  // handles padding calculations; prioritizes paddingX
  expect(coords.nx(-1)).toBe(10);
  expect(coords.nx(1)).toBe(90);
  expect(coords.nx(-0.5)).toBe(30);
  expect(coords.nx(0.5)).toBe(70);
  expect(coords.nx(0)).toBe(50);
  // handles a change in padding
  coords.setPaddingX(0.2);
  expect(coords.calculatedPaddingX).toBe(20);
  expect(coords.nx(-1)).toBe(20);
  expect(coords.nx(1)).toBe(80);
});

test("padding-y", () => {
  coords = new crco.CanvasCoordinates({
    baseWidth: 100,
    baseHeight: 100,
    paddingY: 0.1,
    padding: 0.5,
  });
  // handles padding calculations; prioritizes paddingY
  expect(coords.ny(-1)).toBe(10);
  expect(coords.ny(1)).toBe(90);
  expect(coords.ny(-0.5)).toBe(30);
  expect(coords.ny(0.5)).toBe(70);
  expect(coords.ny(0)).toBe(50);
  // handles a change in padding
  coords.setPaddingY(0.2);
  expect(coords.calculatedPaddingY).toBe(20);
  expect(coords.ny(-1)).toBe(20);
  expect(coords.ny(1)).toBe(80);
  // handles a change in orientation
  coords.setOrientationY("up");
  expect(coords.ny(-1)).toBe(80);
  expect(coords.ny(1)).toBe(20);
});
