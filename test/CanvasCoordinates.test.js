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

test("offset-x", () => {
  coords = new crco.CanvasCoordinates({
    baseWidth: 100,
    baseHeight: 100,
    offsetX: 10,
    clamp: false,
  });
  // test offset x
  expect(coords.nx(-1)).toBe(10);
  expect(coords.nx(1)).toBe(110);
  // test with clamp
  coords.setClamp(true);
  expect(coords.nx(1)).toBe(100);
});

test("offset-y", () => {
  coords = new crco.CanvasCoordinates({
    baseWidth: 100,
    baseHeight: 100,
    offsetY: 10,
    clamp: false,
  });
  // test offset y
  expect(coords.ny(-1)).toBe(10);
  expect(coords.ny(1)).toBe(110);
  // test with clamp
  coords.setClamp(true);
  expect(coords.ny(1)).toBe(100);
  // test with orientation up
  coords.setOrientationY("up");
  coords.setClamp(false);
  expect(coords.ny(-1)).toBe(90);
  expect(coords.ny(1)).toBe(-10);
  coords.setClamp(true);
  expect(coords.ny(1)).toBe(0);
});

test("undefined-padding", () => {
  coords = new crco.CanvasCoordinates({
    baseWidth: 100,
    baseHeight: 100,
    offsetX: -50,
    offsetY: -50,
    padding: undefined,
  });
  // test offset y
  expect(coords.ny(-1)).toBe(-50);
  expect(coords.ny(1)).toBe(50);
  expect(coords.nx(-1)).toBe(-50);
  expect(coords.nx(1)).toBe(50);
});

test("padding-with-offset", () => {
  coords = new crco.CanvasCoordinates({
    canvas,
    offsetX: -50,
    offsetY: -50,
    padding: 0.1,
  });
  // test offset y
  expect(coords.ny(-1)).toBe(-40);
  expect(coords.ny(1)).toBe(40);
  expect(coords.nx(-1)).toBe(-40);
  expect(coords.nx(1)).toBe(40);
});

test("resize", () => {
  coords = new crco.CanvasCoordinates({
    canvas,
  });
  // without resize
  expect(coords.nx(-1)).toBe(0);
  expect(coords.nx(0)).toBe(50);
  expect(coords.nx(1)).toBe(100);
  expect(coords.ny(-1)).toBe(0);
  expect(coords.ny(0)).toBe(50);
  expect(coords.ny(1)).toBe(100);
  // using a canvas element resize
  canvas.width = 200;
  canvas.height = 200;
  coords.resize();
  expect(coords.nx(-1)).toBe(0);
  expect(coords.nx(0)).toBe(100);
  expect(coords.nx(1)).toBe(200);
  expect(coords.ny(-1)).toBe(0);
  expect(coords.ny(0)).toBe(100);
  expect(coords.ny(1)).toBe(200);
  // using specific dimensions for resize
  coords.resize(1000, 1000);
  expect(coords.nx(-1)).toBe(0);
  expect(coords.nx(0)).toBe(500);
  expect(coords.nx(1)).toBe(1000);
  expect(coords.ny(-1)).toBe(0);
  expect(coords.ny(0)).toBe(500);
  expect(coords.ny(1)).toBe(1000);
});

test("width", () => {
  coords = new crco.CanvasCoordinates({
    baseWidth: 100,
    baseHeight: 100,
  });
  expect(coords.width()).toBe(100);
  expect(coords.width(1)).toBe(100);
  expect(coords.width(0.5)).toBe(50);
  expect(coords.width(-1)).toBe(-100);
  expect(coords.width(1.5)).toBe(150);
  // unaffected by clamp
  coords.setClamp(true);
  expect(coords.width(1.5)).toBe(150);
  // test with padding
  coords.setPadding(0.1);
  expect(coords.width()).toBe(80);
  expect(coords.width(0.5)).toBe(40);
  coords.setPaddingX(0.2);
  expect(coords.width()).toBe(60);
  expect(coords.width(0.5)).toBe(30);
});

test("height", () => {
  coords = new crco.CanvasCoordinates({
    baseWidth: 100,
    baseHeight: 100,
  });
  expect(coords.height()).toBe(100);
  expect(coords.height(1)).toBe(100);
  expect(coords.height(0.5)).toBe(50);
  expect(coords.height(-1)).toBe(-100);
  expect(coords.height(1.5)).toBe(150);
  // unaffected by clamp
  coords.setClamp(true);
  expect(coords.width(1.5)).toBe(150);
  // test with padding
  coords.setPadding(0.1);
  expect(coords.height()).toBe(80);
  expect(coords.height(0.5)).toBe(40);
  coords.setPaddingY(0.2);
  expect(coords.height()).toBe(60);
  expect(coords.height(0.5)).toBe(30);
});
